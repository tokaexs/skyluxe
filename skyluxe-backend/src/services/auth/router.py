from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta
from typing import Optional
import uuid
from jose import jwt, JWTError

from src.common.database import get_db
from src.common.models import (
    User, UserSession, UserDevice, ActivityLog, Wallet, UserPreference
)
from src.common.security import (
    verify_password, get_password_hash, create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES, SECRET_KEY, ALGORITHM
)
from src.services.auth.schemas import (
    UserCreate, UserLogin, Token, UserResponse, UserMeResponse, SocialAuthRequest
)
from src.common.oauth import verify_google_token, verify_apple_token



router = APIRouter()

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user_data.email))
    existing_user = result.scalars().first()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        first_name=new_user.first_name,
        last_name=new_user.last_name,
        role=new_user.role
    )

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == user_data.email))
    user = result.scalars().first()
    
    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserMeResponse)
async def get_me(authorization: Optional[str] = Header(None), db: AsyncSession = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication credentials",
        )
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
        
    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user

@router.post("/google", response_model=Token)
async def google_auth(payload: SocialAuthRequest, db: AsyncSession = Depends(get_db)):
    try:
        profile = verify_google_token(payload.id_token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Google authentication failed: {str(e)}"
        )
        
    google_id = profile["id"]
    email = profile["email"]
    name = profile["name"]
    picture = profile["picture"]
    email_verified = profile["email_verified"]
    
    # 1. Search for user by google_id
    result = await db.execute(select(User).filter(User.google_id == google_id))
    user = result.scalars().first()
    
    # 2. Account linking: Search for user by email if google_id not linked
    if not user:
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalars().first()
        if user:
            # Link existing email account to Google ID
            user.google_id = google_id
            user.auth_provider = "GOOGLE"
            user.email_verified = True
            if picture and not user.profile_image:
                user.profile_image = picture
            await db.flush()
            
    # 3. Create user if doesn't exist
    if not user:
        name_parts = name.split(" ")
        first_name = name_parts[0] if name_parts else "Google"
        last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else "User"
        
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            google_id=google_id,
            auth_provider="GOOGLE",
            email_verified=email_verified,
            profile_image=picture,
            membership_tier="silver",
            coins_balance=1000
        )
        db.add(user)
        await db.flush()
        
        # Initialize FBO Wallet
        wallet = Wallet(user_id=user.id, balance=1500000.0)
        db.add(wallet)
        
        # Initialize Preferences
        pref = UserPreference(
            user_id=user.id,
            dietary="None",
            beverages="Water",
            cabin_ambiance="Standard",
            ground_transport="No Transport Required"
        )
        db.add(pref)
        await db.flush()

    # 4. Generate access & refresh tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    
    # 5. Save Session log
    session = UserSession(
        user_id=user.id,
        token_hash=str(hash(access_token)),
        device_info="Web Browser",
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(session)
    
    # Save Device Log
    device = UserDevice(
        user_id=user.id,
        device_name="Web App",
        os="Browser"
    )
    db.add(device)
    
    # Save Activity Log
    activity = ActivityLog(
        user_id=user.id,
        description="Signed in successfully using Google OAuth"
    )
    db.add(activity)
    
    await db.commit()
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/apple", response_model=Token)
async def apple_auth(payload: SocialAuthRequest, db: AsyncSession = Depends(get_db)):
    try:
        profile = verify_apple_token(payload.id_token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Apple authentication failed: {str(e)}"
        )
        
    apple_id = profile["id"]
    email = profile["email"] or f"{apple_id}@privaterelay.appleid.com" # Apple Private Relay Email fallback
    name = profile["name"]
    email_verified = profile["email_verified"]
    
    # 1. Search by apple_id
    result = await db.execute(select(User).filter(User.apple_id == apple_id))
    user = result.scalars().first()
    
    # 2. Account linking by email
    if not user:
        result = await db.execute(select(User).filter(User.email == email))
        user = result.scalars().first()
        if user:
            user.apple_id = apple_id
            user.auth_provider = "APPLE"
            user.email_verified = True
            await db.flush()
            
    # 3. Create user if doesn't exist
    if not user:
        name_parts = name.split(" ")
        first_name = name_parts[0] if name_parts else "Apple"
        last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else "User"
        
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            apple_id=apple_id,
            auth_provider="APPLE",
            email_verified=email_verified,
            membership_tier="silver",
            coins_balance=1000
        )
        db.add(user)
        await db.flush()
        
        # Initialize FBO Wallet
        wallet = Wallet(user_id=user.id, balance=1500000.0)
        db.add(wallet)
        
        # Initialize Preferences
        pref = UserPreference(
            user_id=user.id,
            dietary="None",
            beverages="Water",
            cabin_ambiance="Standard",
            ground_transport="No Transport Required"
        )
        db.add(pref)
        await db.flush()

    # 4. Generate access & refresh tokens
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    
    # 5. Save Session log
    session = UserSession(
        user_id=user.id,
        token_hash=str(hash(access_token)),
        device_info="Apple Device Client",
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(session)
    
    # Save Device Log
    device = UserDevice(
        user_id=user.id,
        device_name="iOS/Safari Client",
        os="Apple OS"
    )
    db.add(device)
    
    # Save Activity Log
    activity = ActivityLog(
        user_id=user.id,
        description="Signed in successfully using Apple Auth"
    )
    db.add(activity)
    
    await db.commit()
    return {"access_token": access_token, "token_type": "bearer"}



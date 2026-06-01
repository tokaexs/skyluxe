from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from src.common.database import get_db
from src.common.models import User
from src.services.users.schemas import UserUpdate, UserProfileResponse

router = APIRouter()

@router.get("/{user_id}", response_model=UserProfileResponse)
async def get_user_profile(user_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    return user

@router.patch("/{user_id}", response_model=UserProfileResponse)
async def update_user_profile(user_id: UUID, update_data: UserUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    update_dict = update_data.dict(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(user, key, value)
        
    await db.commit()
    await db.refresh(user)
    return user

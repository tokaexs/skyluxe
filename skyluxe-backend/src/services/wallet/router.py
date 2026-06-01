from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from uuid import UUID

from src.common.database import get_db
from src.common.models import User, Wallet, WalletTransaction
from src.services.wallet.schemas import WalletResponse, TopUpRequest, TopUpResponse

router = APIRouter()

@router.get("/", response_model=WalletResponse)
async def get_wallet(user_id: UUID, db: AsyncSession = Depends(get_db)):
    # Query wallet with transactions eager-loaded
    result = await db.execute(
        select(Wallet)
        .filter(Wallet.user_id == user_id)
        .options(selectinload(Wallet.transactions))
    )
    wallet = result.scalars().first()
    
    if not wallet:
        # Create a new wallet on the fly if it doesn't exist
        user_result = await db.execute(select(User).filter(User.id == user_id))
        user = user_result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        wallet = Wallet(user_id=user_id, balance=0.0)
        db.add(wallet)
        await db.commit()
        await db.refresh(wallet)
        
        # Re-query to load empty list
        result = await db.execute(
            select(Wallet)
            .filter(Wallet.user_id == user_id)
            .options(selectinload(Wallet.transactions))
        )
        wallet = result.scalars().first()
        
    # Sort transactions by creation date desc
    wallet.transactions.sort(key=lambda tx: tx.created_at, reverse=True)
    return wallet

@router.post("/topup", response_model=TopUpResponse)
async def topup_wallet(
    payload: TopUpRequest, 
    user_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    if payload.amount <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Top-up amount must be greater than zero."
        )
        
    # Query wallet
    result = await db.execute(select(Wallet).filter(Wallet.user_id == user_id))
    wallet = result.scalars().first()
    
    if not wallet:
        # Create wallet if it doesn't exist
        user_result = await db.execute(select(User).filter(User.id == user_id))
        user = user_result.scalars().first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
        wallet = Wallet(user_id=user_id, balance=0.0)
        db.add(wallet)
        await db.flush()
        
    # Update balance
    wallet.balance += payload.amount
    
    # Create wallet transaction
    wallet_tx = WalletTransaction(
        wallet_id=wallet.id,
        description="FBO Corporate Account Top-up",
        amount=payload.amount,
        type="credit"
    )
    db.add(wallet_tx)
    
    await db.commit()
    
    return TopUpResponse(
        status="success",
        message=f"Successfully credited ${payload.amount:,.2f} to FBO Wallet.",
        new_balance=wallet.balance
    )

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID

from src.common.database import get_db
from src.common.models import User, RewardTransaction, Coupon, CouponRedemption
from src.services.rewards.schemas import (
    RewardsOverviewResponse, RewardTransactionResponse, CouponResponse,
    CouponRedemptionResponse, RedeemRequest, RedeemResponse
)

router = APIRouter()

@router.get("/", response_model=RewardsOverviewResponse)
async def get_rewards_overview(user_id: UUID, db: AsyncSession = Depends(get_db)):
    # 1. Fetch user to check balance
    user_result = await db.execute(select(User).filter(User.id == user_id))
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 2. Fetch reward transactions
    tx_result = await db.execute(
        select(RewardTransaction)
        .filter(RewardTransaction.user_id == user_id)
        .order_by(RewardTransaction.created_at.desc())
    )
    transactions = tx_result.scalars().all()
    
    # 3. Fetch available coupons
    coupons_result = await db.execute(select(Coupon))
    coupons = coupons_result.scalars().all()
    
    # 4. Fetch redemptions for this user
    redemptions_result = await db.execute(
        select(CouponRedemption)
        .filter(CouponRedemption.user_id == user_id)
        .order_by(CouponRedemption.redeemed_date.desc())
    )
    redemptions_raw = redemptions_result.scalars().all()
    
    # Map redemptions and load their associated Coupon
    redemptions_response = []
    for r in redemptions_raw:
        coupon_info_result = await db.execute(select(Coupon).filter(Coupon.id == r.coupon_id))
        coupon = coupon_info_result.scalars().first()
        
        redemptions_response.append(
            CouponRedemptionResponse(
                id=r.id,
                user_id=r.user_id,
                coupon_id=r.coupon_id,
                redeemed_date=r.redeemed_date,
                coupon=CouponResponse.from_orm(coupon) if coupon else None
            )
        )
        
    return RewardsOverviewResponse(
        coins_balance=user.coins_balance,
        transactions=[RewardTransactionResponse.from_orm(t) for t in transactions],
        coupons=[CouponResponse.from_orm(c) for c in coupons],
        redemptions=redemptions_response
    )

@router.post("/redeem", response_model=RedeemResponse)
async def redeem_coupon(
    payload: RedeemRequest, 
    user_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    # 1. Fetch user
    user_result = await db.execute(select(User).filter(User.id == user_id))
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 2. Fetch coupon
    coupon_result = await db.execute(select(Coupon).filter(Coupon.id == payload.coupon_id))
    coupon = coupon_result.scalars().first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
        
    # 3. Check coins balance
    if user.coins_balance < coupon.points_required:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient coins. Required: {coupon.points_required}, Available: {user.coins_balance}"
        )
        
    # 4. Perform redemption
    user.coins_balance -= coupon.points_required
    
    # Create redemption entry
    redemption = CouponRedemption(
        user_id=user.id,
        coupon_id=coupon.id
    )
    db.add(redemption)
    
    # Log debit reward transaction
    reward_tx = RewardTransaction(
        user_id=user.id,
        amount=coupon.points_required,
        type="debit",
        description=f"Redeemed {coupon.brand} - {coupon.offer}"
    )
    db.add(reward_tx)
    
    await db.commit()
    
    return RedeemResponse(
        status="success",
        message=f"Successfully redeemed {coupon.brand} offer!",
        remaining_coins=user.coins_balance
    )

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class RewardTransactionResponse(BaseModel):
    id: UUID
    user_id: UUID
    amount: int
    type: str  # credit, debit
    description: str
    created_at: datetime

    class Config:
        from_attributes = True

class CouponResponse(BaseModel):
    id: UUID
    brand: str
    offer: str
    points_required: int
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class CouponRedemptionResponse(BaseModel):
    id: UUID
    user_id: UUID
    coupon_id: UUID
    redeemed_date: datetime
    coupon: Optional[CouponResponse] = None

    class Config:
        from_attributes = True

class RewardsOverviewResponse(BaseModel):
    coins_balance: int
    transactions: List[RewardTransactionResponse] = []
    coupons: List[CouponResponse] = []
    redemptions: List[CouponRedemptionResponse] = []

    class Config:
        from_attributes = True

class RedeemRequest(BaseModel):
    coupon_id: UUID

class RedeemResponse(BaseModel):
    status: str
    message: str
    remaining_coins: int

    class Config:
        from_attributes = True

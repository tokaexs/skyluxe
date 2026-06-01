from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class BenefitResponse(BaseModel):
    id: UUID
    benefit_text: str

    class Config:
        from_attributes = True

class MembershipPlanResponse(BaseModel):
    id: UUID
    name: str
    annual_price: float
    expected_savings: float
    multiplier: str
    description: Optional[str] = None
    benefits: List[str] = []

    class Config:
        from_attributes = True

class SubscribeRequest(BaseModel):
    plan_id: UUID

class SubscribeResponse(BaseModel):
    status: str
    message: str
    membership_tier: str

    class Config:
        from_attributes = True

class ApplicationRequest(BaseModel):
    proposed_tier: str

class ApplicationResponse(BaseModel):
    id: UUID
    user_id: UUID
    proposed_tier: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class MembershipTransactionResponse(BaseModel):
    id: UUID
    user_id: UUID
    plan_id: UUID
    price_paid: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

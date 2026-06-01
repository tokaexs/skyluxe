from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class WalletTransactionResponse(BaseModel):
    id: UUID
    wallet_id: UUID
    description: str
    amount: float
    type: str  # credit, debit
    created_at: datetime

    class Config:
        from_attributes = True

class WalletResponse(BaseModel):
    id: UUID
    user_id: UUID
    balance: float
    transactions: List[WalletTransactionResponse] = []

    class Config:
        from_attributes = True

class TopUpRequest(BaseModel):
    amount: float

class TopUpResponse(BaseModel):
    status: str
    message: str
    new_balance: float

    class Config:
        from_attributes = True

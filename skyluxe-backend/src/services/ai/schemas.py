from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class ConciergeRequestCreate(BaseModel):
    type: str
    details: str

class ConciergeRequestResponse(BaseModel):
    id: UUID
    user_id: UUID
    type: str
    details: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

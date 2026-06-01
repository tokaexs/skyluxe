from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID

class NotificationResponse(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    message: str
    unread: bool
    type: str  # flight, security, wallet
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationCreate(BaseModel):
    title: str
    message: str
    type: Optional[str] = "flight"

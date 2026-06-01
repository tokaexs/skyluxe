from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from src.services.auth.schemas import UserResponse

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    two_factor_enabled: Optional[bool] = None

class UserProfileResponse(UserResponse):
    two_factor_enabled: bool

    class Config:
        orm_mode = True

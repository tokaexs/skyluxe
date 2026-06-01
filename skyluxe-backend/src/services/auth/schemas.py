from pydantic import BaseModel, EmailStr
from typing import Optional
from src.common.models import UserRole

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    role: UserRole

    class Config:
        from_attributes = True

class UserMeResponse(UserResponse):
    membership_tier: str
    coins_balance: int
    phone: Optional[str] = None
    country: Optional[str] = None
    profile_image: Optional[str] = None

class SocialAuthRequest(BaseModel):
    id_token: str



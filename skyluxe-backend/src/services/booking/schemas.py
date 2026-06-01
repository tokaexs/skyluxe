from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID
from src.common.models import BookingStatus
from src.services.flights.schemas import FlightResponse

class PassengerCreate(BaseModel):
    name: str
    age: int
    passport: Optional[str] = None

class BookingBase(BaseModel):
    flight_id: UUID
    total_amount: float

class BookingCreate(BookingBase):
    seat_number: Optional[str] = None
    passengers: Optional[List[PassengerCreate]] = None

class PassengerResponse(BaseModel):
    id: UUID
    booking_id: UUID
    name: str
    age: int
    passport: Optional[str] = None

    class Config:
        from_attributes = True

class BoardingPassResponse(BaseModel):
    id: UUID
    booking_id: UUID
    qr_code_data: str
    boarding_time: Optional[str] = None
    gate: str
    terminal: str

    class Config:
        from_attributes = True

class BookingResponse(BookingBase):
    id: UUID
    user_id: UUID
    status: BookingStatus
    seat_number: Optional[str] = None
    created_at: datetime
    flight: Optional[FlightResponse] = None
    boarding_passes: List[BoardingPassResponse] = []
    passengers: List[PassengerResponse] = []

    class Config:
        from_attributes = True

# --- CHARTER SCHEMAS ---

class CharterBookingCreate(BaseModel):
    aircraft_id: UUID
    legs: List[Dict[str, Any]]
    catering: Optional[str] = None
    chauffeur: Optional[str] = None
    security: Optional[str] = None
    price: float

class CharterBookingResponse(BaseModel):
    id: UUID
    user_id: UUID
    aircraft_id: UUID
    legs: List[Dict[str, Any]]
    catering: Optional[str] = None
    chauffeur: Optional[str] = None
    security: Optional[str] = None
    price: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

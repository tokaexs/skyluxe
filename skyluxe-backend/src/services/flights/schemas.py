from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class FleetBase(BaseModel):
    model: str
    tail_number: str
    capacity: int
    hourly_rate: float
    current_location: Optional[str] = None

class FleetCreate(FleetBase):
    pass

class FleetResponse(FleetBase):
    id: UUID

    class Config:
        orm_mode = True

class FlightBase(BaseModel):
    jet_id: UUID
    origin: str
    destination: str
    departure_time: datetime
    arrival_time: datetime
    base_price: float

class FlightCreate(FlightBase):
    pass

class FlightResponse(FlightBase):
    id: UUID
    jet: Optional[FleetResponse] = None

    class Config:
        orm_mode = True

class PrivateAircraftResponse(BaseModel):
    id: UUID
    model: str
    range_nm: str
    speed: str
    capacity: int
    hourly_rate: float
    class_type: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    amenities: List[str] = []

    class Config:
        from_attributes = True


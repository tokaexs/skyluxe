from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class DestinationGuideResponse(BaseModel):
    id: UUID
    destination_id: UUID
    category: str
    title: str
    details: str

    class Config:
        from_attributes = True

class DestinationResponse(BaseModel):
    id: UUID
    name: str
    region: str
    image_url: Optional[str] = None
    overview: Optional[str] = None
    best_time: Optional[str] = None
    airport: Optional[str] = None
    guides: List[DestinationGuideResponse] = []

    class Config:
        from_attributes = True

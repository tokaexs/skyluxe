from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from src.common.database import get_db
from src.common.models import Destination
from src.services.destinations.schemas import DestinationResponse

router = APIRouter()

@router.get("/", response_model=List[DestinationResponse])
async def get_destinations(region: str = None, db: AsyncSession = Depends(get_db)):
    query = select(Destination).options(selectinload(Destination.guides))
    if region:
        query = query.filter(Destination.region.ilike(f"%{region}%"))
        
    result = await db.execute(query)
    return result.scalars().all()

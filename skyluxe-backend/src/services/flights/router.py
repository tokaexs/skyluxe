from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from src.common.database import get_db
from src.common.models import Fleet, Flight, PrivateAircraft, AircraftAmenity
from src.services.flights.schemas import (
    FleetCreate, FleetResponse, FlightCreate, FlightResponse, PrivateAircraftResponse
)


router = APIRouter()

@router.get("/fleet", response_model=List[FleetResponse])
async def get_fleet(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Fleet))
    return result.scalars().all()

@router.post("/fleet", response_model=FleetResponse, status_code=status.HTTP_201_CREATED)
async def create_fleet_asset(asset: FleetCreate, db: AsyncSession = Depends(get_db)):
    # In production, require Admin role
    new_asset = Fleet(**asset.dict())
    db.add(new_asset)
    await db.commit()
    await db.refresh(new_asset)
    return new_asset

@router.get("/flights", response_model=List[FlightResponse])
async def get_flights(origin: str = None, destination: str = None, db: AsyncSession = Depends(get_db)):
    query = select(Flight)
    if origin:
        query = query.filter(Flight.origin.ilike(f"%{origin}%"))
    if destination:
        query = query.filter(Flight.destination.ilike(f"%{destination}%"))
        
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/flights", response_model=FlightResponse, status_code=status.HTTP_201_CREATED)
async def create_flight(flight: FlightCreate, db: AsyncSession = Depends(get_db)):
    # Check if jet exists
    result = await db.execute(select(Fleet).filter(Fleet.id == flight.jet_id))
    jet = result.scalars().first()
    if not jet:
        raise HTTPException(status_code=404, detail="Aircraft not found")
        
    new_flight = Flight(**flight.dict())
    db.add(new_flight)
    await db.commit()
    await db.refresh(new_flight)
    return new_flight

@router.get("/jets", response_model=List[PrivateAircraftResponse])
async def get_private_jets(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PrivateAircraft))
    jets = result.scalars().all()
    
    response = []
    for jet in jets:
        # Fetch amenities
        amenities_result = await db.execute(
            select(AircraftAmenity).filter(AircraftAmenity.aircraft_id == jet.id)
        )
        amenities = [a.amenity_text for a in amenities_result.scalars().all()]
        
        response.append(
            PrivateAircraftResponse(
                id=jet.id,
                model=jet.model,
                range_nm=jet.range_nm,
                speed=jet.speed,
                capacity=jet.capacity,
                hourly_rate=jet.hourly_rate,
                class_type=jet.class_type,
                description=jet.description,
                image_url=jet.image_url,
                amenities=amenities
            )
        )
    return response

@router.get("/jets/{jet_id}", response_model=PrivateAircraftResponse)
async def get_private_jet_by_id(jet_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PrivateAircraft).filter(PrivateAircraft.id == jet_id))
    jet = result.scalars().first()
    
    if not jet:
        raise HTTPException(status_code=404, detail="Private aircraft not found")
        
    amenities_result = await db.execute(
        select(AircraftAmenity).filter(AircraftAmenity.aircraft_id == jet.id)
    )
    amenities = [a.amenity_text for a in amenities_result.scalars().all()]
    
    return PrivateAircraftResponse(
        id=jet.id,
        model=jet.model,
        range_nm=jet.range_nm,
        speed=jet.speed,
        capacity=jet.capacity,
        hourly_rate=jet.hourly_rate,
        class_type=jet.class_type,
        description=jet.description,
        image_url=jet.image_url,
        amenities=amenities
    )


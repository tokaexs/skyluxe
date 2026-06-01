from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
from uuid import UUID
from datetime import datetime

from src.common.database import get_db
from src.common.models import (
    Booking, Flight, User, Wallet, WalletTransaction, Passenger, 
    BoardingPass, RewardTransaction, ActivityLog, PrivateAircraft, CharterBooking, BookingStatus
)
from src.services.booking.schemas import (
    BookingCreate, BookingResponse, CharterBookingCreate, CharterBookingResponse,
    PassengerResponse, BoardingPassResponse
)
from src.services.flights.schemas import FlightResponse, FleetResponse

router = APIRouter()

@router.get("/", response_model=List[BookingResponse])
async def get_user_bookings(user_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Booking)
        .filter(Booking.user_id == user_id)
        .options(selectinload(Booking.flight))
        .order_by(Booking.created_at.desc())
    )
    bookings = result.scalars().all()
    
    response = []
    for b in bookings:
        # Load passengers
        p_res = await db.execute(select(Passenger).filter(Passenger.booking_id == b.id))
        passengers = p_res.scalars().all()
        
        # Load boarding passes
        bp_res = await db.execute(select(BoardingPass).filter(BoardingPass.booking_id == b.id))
        boarding_passes = bp_res.scalars().all()
        
        # Map flight details
        flight_data = None
        if b.flight:
            flight_data = FlightResponse(
                id=b.flight.id,
                jet_id=b.flight.jet_id,
                origin=b.flight.origin,
                destination=b.flight.destination,
                departure_time=b.flight.departure_time,
                arrival_time=b.flight.arrival_time,
                base_price=b.flight.base_price,
                jet=FleetResponse.from_orm(b.flight.jet) if b.flight.jet else None
            )
            
        response.append(
            BookingResponse(
                id=b.id,
                user_id=b.user_id,
                flight_id=b.flight_id,
                seat_number=b.seat_number,
                total_amount=b.total_amount,
                status=b.status,
                created_at=b.created_at,
                flight=flight_data,
                boarding_passes=[BoardingPassResponse.from_orm(bp) for bp in boarding_passes],
                passengers=[PassengerResponse.from_orm(p) for p in passengers]
            )
        )
    return response

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(booking: BookingCreate, user_id: UUID, db: AsyncSession = Depends(get_db)):
    # 1. Verify user exists
    user_result = await db.execute(select(User).filter(User.id == user_id))
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 2. Verify flight exists
    flight_result = await db.execute(
        select(Flight)
        .filter(Flight.id == booking.flight_id)
        .options(selectinload(Flight.jet))
    )
    flight = flight_result.scalars().first()
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found")
        
    # 3. Check and deduct FBO wallet balance
    wallet_result = await db.execute(select(Wallet).filter(Wallet.user_id == user.id))
    wallet = wallet_result.scalars().first()
    if not wallet:
        wallet = Wallet(user_id=user.id, balance=0.0)
        db.add(wallet)
        await db.flush()
        
    if wallet.balance < booking.total_amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient wallet balance. Price: ${booking.total_amount:,.2f}"
        )
        
    # Deduct funds
    wallet.balance -= booking.total_amount
    
    # Create wallet transaction log
    wallet_tx = WalletTransaction(
        wallet_id=wallet.id,
        description=f"Commercial flight booking {flight.origin} to {flight.destination}",
        amount=booking.total_amount,
        type="debit"
    )
    db.add(wallet_tx)
    
    # 4. Create the booking
    new_booking = Booking(
        user_id=user_id,
        flight_id=booking.flight_id,
        seat_number=booking.seat_number or "1A",
        total_amount=booking.total_amount,
        status=BookingStatus.CONFIRMED
    )
    db.add(new_booking)
    await db.flush()
    
    # 5. Add passenger records
    passenger_objs = []
    if booking.passengers:
        for p in booking.passengers:
            p_obj = Passenger(
                booking_id=new_booking.id,
                name=p.name,
                age=p.age,
                passport=p.passport
            )
            db.add(p_obj)
            passenger_objs.append(p_obj)
    else:
        # Default user as passenger
        p_obj = Passenger(
            booking_id=new_booking.id,
            name=f"{user.first_name} {user.last_name}",
            age=35,
            passport="US12345678"
        )
        db.add(p_obj)
        passenger_objs.append(p_obj)
        
    # 6. Generate Boarding Pass
    boarding_pass = BoardingPass(
        booking_id=new_booking.id,
        qr_code_data=f"SKYLUXE|{new_booking.id}|{flight.origin}|{flight.destination}|{new_booking.seat_number}",
        boarding_time=(flight.departure_time - timedelta(minutes=45)).strftime("%H:%M") if hasattr(flight, 'departure_time') else "10:00",
        gate="B3",
        terminal="T3"
    )
    db.add(boarding_pass)
    
    # 7. Credit SkyCoins (1% of booking cost)
    coins_earned = max(10, int(booking.total_amount * 0.01))
    user.coins_balance += coins_earned
    
    reward_tx = RewardTransaction(
        user_id=user.id,
        amount=coins_earned,
        type="credit",
        description=f"SkyCoins earned for flight booking {flight.origin}-{flight.destination}"
    )
    db.add(reward_tx)
    
    # 8. Add activity log
    activity = ActivityLog(
        user_id=user.id,
        description=f"Booked commercial flight from {flight.origin} to {flight.destination}"
    )
    db.add(activity)
    
    await db.commit()
    await db.refresh(new_booking)
    
    # Map to flight response
    flight_data = FlightResponse(
        id=flight.id,
        jet_id=flight.jet_id,
        origin=flight.origin,
        destination=flight.destination,
        departure_time=flight.departure_time,
        arrival_time=flight.arrival_time,
        base_price=flight.base_price,
        jet=FleetResponse.from_orm(flight.jet) if flight.jet else None
    )
    
    return BookingResponse(
        id=new_booking.id,
        user_id=new_booking.user_id,
        flight_id=new_booking.flight_id,
        seat_number=new_booking.seat_number,
        total_amount=new_booking.total_amount,
        status=new_booking.status,
        created_at=new_booking.created_at,
        flight=flight_data,
        boarding_passes=[BoardingPassResponse.from_orm(boarding_pass)],
        passengers=[PassengerResponse.from_orm(p) for p in passenger_objs]
    )

@router.post("/charter", response_model=CharterBookingResponse, status_code=status.HTTP_201_CREATED)
async def create_charter_booking(
    charter: CharterBookingCreate, 
    user_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    # 1. Verify user exists
    user_result = await db.execute(select(User).filter(User.id == user_id))
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # 2. Verify jet exists
    jet_result = await db.execute(select(PrivateAircraft).filter(PrivateAircraft.id == charter.aircraft_id))
    jet = jet_result.scalars().first()
    if not jet:
        raise HTTPException(status_code=404, detail="Private aircraft asset not found")
        
    # 3. Check and deduct FBO wallet balance
    wallet_result = await db.execute(select(Wallet).filter(Wallet.user_id == user.id))
    wallet = wallet_result.scalars().first()
    if not wallet:
        wallet = Wallet(user_id=user.id, balance=0.0)
        db.add(wallet)
        await db.flush()
        
    if wallet.balance < charter.price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient wallet balance. Price: ${charter.price:,.2f}"
        )
        
    # Deduct funds
    wallet.balance -= charter.price
    
    # Create wallet transaction log
    wallet_tx = WalletTransaction(
        wallet_id=wallet.id,
        description=f"Private charter leg booking on {jet.model}",
        amount=charter.price,
        type="debit"
    )
    db.add(wallet_tx)
    
    # 4. Create Charter booking
    new_charter = CharterBooking(
        user_id=user.id,
        aircraft_id=charter.aircraft_id,
        legs=charter.legs,
        catering=charter.catering,
        chauffeur=charter.chauffeur,
        security=charter.security,
        price=charter.price,
        status="Confirmed"
    )
    db.add(new_charter)
    await db.flush()
    
    # 5. Credit SkyCoins (1% of booking cost)
    coins_earned = max(100, int(charter.price * 0.01))
    user.coins_balance += coins_earned
    
    reward_tx = RewardTransaction(
        user_id=user.id,
        amount=coins_earned,
        type="credit",
        description=f"SkyCoins earned for private charter charter booking on {jet.model}"
    )
    db.add(reward_tx)
    
    # 6. Add activity log
    activity = ActivityLog(
        user_id=user.id,
        description=f"Booked private jet charter ({jet.model}) legs: {len(charter.legs)}"
    )
    db.add(activity)
    
    await db.commit()
    await db.refresh(new_charter)
    
    return new_charter

@router.get("/charters", response_model=List[CharterBookingResponse])
async def get_user_charters(user_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(CharterBooking)
        .filter(CharterBooking.user_id == user_id)
        .order_by(CharterBooking.created_at.desc())
    )
    return result.scalars().all()

@router.patch("/{booking_id}/status", response_model=BookingResponse)
async def update_booking_status(booking_id: UUID, status: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Booking).filter(Booking.id == booking_id))
    booking = result.scalars().first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    booking.status = status
    await db.commit()
    await db.refresh(booking)
    
    # Re-fetch passengers and passes to format response
    p_res = await db.execute(select(Passenger).filter(Passenger.booking_id == booking.id))
    passengers = p_res.scalars().all()
    
    bp_res = await db.execute(select(BoardingPass).filter(BoardingPass.booking_id == booking.id))
    boarding_passes = bp_res.scalars().all()
    
    return BookingResponse(
        id=booking.id,
        user_id=booking.user_id,
        flight_id=booking.flight_id,
        seat_number=booking.seat_number,
        total_amount=booking.total_amount,
        status=booking.status,
        created_at=booking.created_at,
        boarding_passes=[BoardingPassResponse.from_orm(bp) for bp in boarding_passes],
        passengers=[PassengerResponse.from_orm(p) for p in passengers]
    )

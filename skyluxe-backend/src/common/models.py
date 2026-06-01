import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, ForeignKey, DateTime, Enum, Uuid, JSON
from sqlalchemy.orm import relationship
from .database import Base
import enum

# --- ENUMS ---

class UserRole(str, enum.Enum):
    CUSTOMER = "CUSTOMER"
    VIP = "VIP"
    AGENT = "AGENT"
    ADMIN = "ADMIN"

class BookingStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class ConciergeRequestStatus(str, enum.Enum):
    PENDING = "Pending"
    ASSIGNED = "Assigned"
    IN_PROGRESS = "In Progress"
    IN_TRANSIT = "In Transit"
    COMPLETED = "Completed"

# --- AUTH & USER SCHEMAS ---

class User(Base):
    __tablename__ = "users"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=True)  # Nullable for OAuth users
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.CUSTOMER)
    membership_tier = Column(String, default="silver") # silver, executive, black-elite
    coins_balance = Column(Integer, default=1000)
    profile_image = Column(String, nullable=True)
    country = Column(String, default="India")
    two_factor_enabled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Social OAuth columns
    google_id = Column(String, unique=True, index=True, nullable=True)
    apple_id = Column(String, unique=True, index=True, nullable=True)
    auth_provider = Column(String, default="EMAIL")  # EMAIL, GOOGLE, APPLE
    avatar_url = Column(String, nullable=True)
    email_verified = Column(Boolean, default=False)
    provider_metadata = Column(JSON, nullable=True)

    
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", uselist=False, cascade="all, delete-orphan")
    wallet = relationship("Wallet", back_populates="user", uselist=False, cascade="all, delete-orphan")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    devices = relationship("UserDevice", back_populates="user", cascade="all, delete-orphan")

class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String, nullable=False)
    device_info = Column(String, nullable=True)
    ip_address = Column(String, nullable=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sessions")

class UserDevice(Base):
    __tablename__ = "user_devices"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    device_name = Column(String, nullable=False)
    os = Column(String, nullable=True)
    last_used = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="devices")

class PasswordResetToken(Base):
    __tablename__ = "password_resets"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)

class EmailVerificationToken(Base):
    __tablename__ = "email_verifications"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    token = Column(String, unique=True, nullable=False)
    verified = Column(Boolean, default=False)

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    dietary = Column(String, default="None")
    beverages = Column(String, default="Water")
    cabin_ambiance = Column(String, default="Standard")
    ground_transport = Column(String, default="No Transport Required")

    user = relationship("User", back_populates="preferences")

# --- MEMBERSHIP SCHEMAS ---

class MembershipPlan(Base):
    __tablename__ = "membership_plans"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String, unique=True, nullable=False)
    annual_price = Column(Float, nullable=False)
    expected_savings = Column(Float, nullable=False)
    multiplier = Column(String, nullable=False)
    description = Column(String, nullable=True)

class MembershipBenefit(Base):
    __tablename__ = "membership_benefits"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    plan_id = Column(Uuid, ForeignKey("membership_plans.id"), nullable=False)
    benefit_text = Column(String, nullable=False)

class UserMembership(Base):
    __tablename__ = "user_memberships"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Uuid, ForeignKey("membership_plans.id"), nullable=False)
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=False)
    auto_renew = Column(Boolean, default=True)

class MembershipTransaction(Base):
    __tablename__ = "membership_transactions"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    plan_id = Column(Uuid, ForeignKey("membership_plans.id"), nullable=False)
    price_paid = Column(Float, nullable=False)
    status = Column(String, default="Success")
    created_at = Column(DateTime, default=datetime.utcnow)

class MembershipApplication(Base):
    __tablename__ = "membership_applications"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    proposed_tier = Column(String, nullable=False)
    status = Column(String, default="Pending") # Pending, Approved, Rejected
    created_at = Column(DateTime, default=datetime.utcnow)

class MembershipInvitation(Base):
    __tablename__ = "membership_invitations"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    recipient_email = Column(String, nullable=False)
    plan_id = Column(Uuid, ForeignKey("membership_plans.id"), nullable=False)
    code = Column(String, unique=True, nullable=False)
    redeemed = Column(Boolean, default=False)

# --- COMMERCIAL FLIGHT SCHEMAS ---

class Airport(Base):
    __tablename__ = "airports"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    code = Column(String, unique=True, index=True, nullable=False) # e.g. BOM, DWC
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    country = Column(String, nullable=False)
    vip_terminal = Column(Boolean, default=True)

class Airline(Base):
    __tablename__ = "airlines"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    code = Column(String, unique=True, index=True, nullable=False) # e.g. EK, AI
    name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)

class Aircraft(Base):
    __tablename__ = "aircraft"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    model = Column(String, nullable=False)
    range_nm = Column(Integer, nullable=True)
    capacity = Column(Integer, nullable=False)
    class_type = Column(String, nullable=True)
    image_url = Column(String, nullable=True)

class FlightRoute(Base):
    __tablename__ = "flight_routes"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    origin_code = Column(String, ForeignKey("airports.code"), nullable=False)
    destination_code = Column(String, ForeignKey("airports.code"), nullable=False)
    base_price = Column(Float, nullable=False)
    duration = Column(String, nullable=False) # e.g. "3h 30m"

class Flight(Base):
    __tablename__ = "flights"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    route_id = Column(Uuid, ForeignKey("flight_routes.id"), nullable=True)
    jet_id = Column(Uuid, ForeignKey("fleet.id"), nullable=True) # Fallback to original fleet relation
    aircraft_id = Column(Uuid, ForeignKey("aircraft.id"), nullable=True)
    airline_code = Column(String, ForeignKey("airlines.code"), nullable=True)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    departure_time = Column(DateTime, nullable=False)
    arrival_time = Column(DateTime, nullable=False)
    base_price = Column(Float, nullable=False)
    status = Column(String, default="Scheduled") # Scheduled, In Air, Landed, Delayed

    jet = relationship("Fleet", back_populates="flights")
    bookings = relationship("Booking", back_populates="flight")

class Seat(Base):
    __tablename__ = "seats"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    flight_id = Column(Uuid, ForeignKey("flights.id"), nullable=False)
    number = Column(String, nullable=False) # e.g. "1A"
    class_type = Column(String, default="Economy") # First, Business, Economy
    surcharge = Column(Float, default=0.0)
    status = Column(String, default="Available") # Available, Occupied

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    flight_id = Column(Uuid, ForeignKey("flights.id"), nullable=False)
    seat_number = Column(String, nullable=True)
    status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    total_amount = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="bookings")
    flight = relationship("Flight", back_populates="bookings")

class Passenger(Base):
    __tablename__ = "passengers"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    booking_id = Column(Uuid, ForeignKey("bookings.id"), nullable=False)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    passport = Column(String, nullable=True)

class BoardingPass(Base):
    __tablename__ = "boarding_passes"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    booking_id = Column(Uuid, ForeignKey("bookings.id"), nullable=False)
    qr_code_data = Column(String, nullable=False)
    boarding_time = Column(String, nullable=True)
    gate = Column(String, default="A1")
    terminal = Column(String, default="T2")

# --- PRIVATE AVIATION SCHEMAS ---

class Fleet(Base):
    __tablename__ = "fleet"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    model = Column(String, nullable=False)
    tail_number = Column(String, unique=True, nullable=False)
    capacity = Column(Integer, nullable=False)
    hourly_rate = Column(Float, nullable=False)
    current_location = Column(String)
    
    flights = relationship("Flight", back_populates="jet")

class PrivateAircraft(Base):
    __tablename__ = "private_aircraft"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    model = Column(String, nullable=False)
    range_nm = Column(String, nullable=False) # e.g. "7,500 nm"
    speed = Column(String, nullable=False) # e.g. "Mach 0.925"
    capacity = Column(Integer, nullable=False)
    hourly_rate = Column(Float, nullable=False)
    class_type = Column(String, nullable=False) # e.g. "Ultra Long Range"
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=True)

class AircraftAmenity(Base):
    __tablename__ = "aircraft_amenities"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    aircraft_id = Column(Uuid, ForeignKey("private_aircraft.id"), nullable=False)
    amenity_text = Column(String, nullable=False)

class CharterRequest(Base):
    __tablename__ = "charter_requests"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    date = Column(String, nullable=False)
    passengers = Column(Integer, nullable=False)
    status = Column(String, default="Pending") # Pending, Assigned, Completed

class CharterBooking(Base):
    __tablename__ = "charter_bookings"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    aircraft_id = Column(Uuid, ForeignKey("private_aircraft.id"), nullable=False)
    legs = Column(JSON, nullable=False) # Array of flight legs
    catering = Column(String, nullable=True)
    chauffeur = Column(String, nullable=True)
    security = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    status = Column(String, default="Confirmed")
    created_at = Column(DateTime, default=datetime.utcnow)

# --- AI CONCIERGE SCHEMAS ---

class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    conversation_id = Column(Uuid, ForeignKey("conversations.id"), nullable=False)
    sender = Column(String, nullable=False) # ai, user
    text = Column(String, nullable=False)
    widget_type = Column(String, nullable=True) # itinerary, approval
    created_at = Column(DateTime, default=datetime.utcnow)

class TravelPlan(Base):
    __tablename__ = "travel_plans"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    destination = Column(String, nullable=False)
    dates = Column(String, nullable=False)
    budget = Column(String, nullable=False)
    style = Column(String, nullable=False)
    itinerary = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ConciergeRequest(Base):
    __tablename__ = "concierge_requests"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False) # Catering, Chauffeur, Security, etc.
    details = Column(String, nullable=False)
    status = Column(Enum(ConciergeRequestStatus), default=ConciergeRequestStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

# --- WALLET & PAYMENT SCHEMAS ---

class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False, unique=True)
    balance = Column(Float, default=1500000.0)

    user = relationship("User", back_populates="wallet")
    transactions = relationship("WalletTransaction", back_populates="wallet", cascade="all, delete-orphan")

class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    wallet_id = Column(Uuid, ForeignKey("wallets.id"), nullable=False)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False) # credit, debit
    created_at = Column(DateTime, default=datetime.utcnow)

    wallet = relationship("Wallet", back_populates="transactions")

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    status = Column(String, default="Success")
    gateway_tx_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# --- REWARDS SCHEMAS ---

class RewardTransaction(Base):
    __tablename__ = "reward_transactions"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    amount = Column(Integer, nullable=False)
    type = Column(String, nullable=False) # credit, debit
    description = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Coupon(Base):
    __tablename__ = "coupons"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    brand = Column(String, nullable=False)
    offer = Column(String, nullable=False)
    points_required = Column(Integer, nullable=False)
    image_url = Column(String, nullable=True)

class CouponRedemption(Base):
    __tablename__ = "coupon_redemptions"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    coupon_id = Column(Uuid, ForeignKey("coupons.id"), nullable=False)
    redeemed_date = Column(DateTime, default=datetime.utcnow)

# --- DESTINATION SCHEMAS ---

class Destination(Base):
    __tablename__ = "destinations"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False)
    region = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    overview = Column(String, nullable=True)
    best_time = Column(String, nullable=True)
    airport = Column(String, nullable=True)

    guides = relationship("DestinationGuide", back_populates="destination", cascade="all, delete-orphan")

class DestinationGuide(Base):
    __tablename__ = "destination_guides"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    destination_id = Column(Uuid, ForeignKey("destinations.id"), nullable=False)
    category = Column(String, nullable=False) # Hotels, Dining, Experiences
    title = Column(String, nullable=False)
    details = Column(String, nullable=False)

    destination = relationship("Destination", back_populates="guides")

# --- UTILITY & DASHBOARD SCHEMAS ---

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    unread = Column(Boolean, default=True)
    type = Column(String, default="flight") # flight, security, wallet
    created_at = Column(DateTime, default=datetime.utcnow)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    description = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Uuid, primary_key=True, default=uuid.uuid4)
    user_id = Column(Uuid, ForeignKey("users.id"), nullable=False)
    subject = Column(String, nullable=False)
    description = Column(String, nullable=False)
    status = Column(String, default="Open") # Open, Resolved, Closed
    created_at = Column(DateTime, default=datetime.utcnow)

import uuid
from datetime import datetime, timedelta
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.common.models import (
    User, UserRole, UserPreference, Wallet, WalletTransaction,
    PrivateAircraft, AircraftAmenity, Airport, Airline, Fleet,
    FlightRoute, Flight, Coupon, Destination, DestinationGuide
)
from src.common.security import get_password_hash

async def seed_database(db: AsyncSession):
    # Check if we already have data
    result = await db.execute(select(User).filter(User.email == "demo@skyluxe.com"))
    if result.scalars().first():
        print("Database already seeded. Skipping...")
        return

    print("Seeding database with production-grade luxury aviation data...")

    # 1. Seed Demo User
    demo_user = User(
        id=uuid.uuid4(),
        email="demo@skyluxe.com",
        password_hash=get_password_hash("Password123"),
        first_name="Alexander",
        last_name="Vanderbilt",
        phone="+1 (555) 777-8888",
        role=UserRole.VIP,
        membership_tier="black-elite",
        coins_balance=12500,
        country="United States",
        profile_image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    )
    db.add(demo_user)
    await db.flush()

    # Seed User Preferences
    preferences = UserPreference(
        id=uuid.uuid4(),
        user_id=demo_user.id,
        dietary="Organic Vegan / Keto-friendly option",
        beverages="Dom Pérignon / Sparkling Water",
        cabin_ambiance="Warm Dim / Relaxed",
        ground_transport="Tesla Model S Plaid Chauffeur"
    )
    db.add(preferences)

    # Seed User Wallet
    wallet = Wallet(
        id=uuid.uuid4(),
        user_id=demo_user.id,
        balance=1500000.0  # $1,500,000 for chartering jets
    )
    db.add(wallet)
    await db.flush()

    # Seed Initial Wallet Transaction
    wallet_tx = WalletTransaction(
        id=uuid.uuid4(),
        wallet_id=wallet.id,
        description="FBO Corporate Account Initialization",
        amount=1500000.0,
        type="credit"
    )
    db.add(wallet_tx)

    # 2. Seed Airports
    airports_data = [
        {"code": "BOM", "name": "Chhatrapati Shivaji Maharaj Intl", "city": "Mumbai", "country": "India", "vip_terminal": True},
        {"code": "DWC", "name": "Al Maktoum International Airport", "city": "Dubai", "country": "UAE", "vip_terminal": True},
        {"code": "JFK", "name": "John F. Kennedy International", "city": "New York", "country": "USA", "vip_terminal": True},
        {"code": "LHR", "name": "Heathrow Airport", "city": "London", "country": "UK", "vip_terminal": True},
        {"code": "SIN", "name": "Changi Airport", "city": "Singapore", "country": "Singapore", "vip_terminal": True},
    ]
    for ap in airports_data:
        db.add(Airport(id=uuid.uuid4(), **ap))

    # 3. Seed Airlines
    airlines_data = [
        {"code": "EK", "name": "Emirates", "logo_url": "https://logos-world.net/wp-content/uploads/2020/03/Emirates-Logo.png"},
        {"code": "SQ", "name": "Singapore Airlines", "logo_url": "https://logos-world.net/wp-content/uploads/2023/01/Singapore-Airlines-Logo.png"},
        {"code": "QR", "name": "Qatar Airways", "logo_url": "https://logos-world.net/wp-content/uploads/2023/01/Qatar-Airways-Logo.png"},
    ]
    for al in airlines_data:
        db.add(Airline(id=uuid.uuid4(), **al))

    # 4. Seed Commercial Fleet
    fleet_data = [
        {"model": "Airbus A380-800", "tail_number": "A6-EVC", "capacity": 489, "hourly_rate": 15000.0, "current_location": "Dubai"},
        {"model": "Boeing 777-300ER", "tail_number": "A6-EQP", "capacity": 354, "hourly_rate": 12000.0, "current_location": "Mumbai"},
        {"model": "Airbus A350-900", "tail_number": "9V-SMC", "capacity": 253, "hourly_rate": 11000.0, "current_location": "Singapore"},
    ]
    fleet_objects = []
    for fl in fleet_data:
        obj = Fleet(id=uuid.uuid4(), **fl)
        db.add(obj)
        fleet_objects.append(obj)
    await db.flush()

    # 5. Seed Private Aircraft
    private_jets = [
        {
            "model": "Gulfstream G700",
            "range_nm": "7,500 nm",
            "speed": "Mach 0.925",
            "capacity": 19,
            "hourly_rate": 9500.0,
            "class_type": "Ultra Long Range",
            "description": "The flagship of luxury private aviation. Ultimate speed and cabin comfort.",
            "image_url": "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=600"
        },
        {
            "model": "Bombardier Global 7500",
            "range_nm": "7,700 nm",
            "speed": "Mach 0.925",
            "capacity": 19,
            "hourly_rate": 9800.0,
            "class_type": "Ultra Long Range",
            "description": "The largest and longest-range business jet, featuring a four-zone cabin and full stateroom.",
            "image_url": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600"
        },
        {
            "model": "Challenger 350",
            "range_nm": "3,200 nm",
            "speed": "Mach 0.83",
            "capacity": 9,
            "hourly_rate": 5500.0,
            "class_type": "Super Midsize",
            "description": "The best-selling business jet, combining class-defining performance and cabin design.",
            "image_url": "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=600"
        }
    ]
    for jet_info in private_jets:
        jet = PrivateAircraft(
            id=uuid.uuid4(),
            model=jet_info["model"],
            range_nm=jet_info["range_nm"],
            speed=jet_info["speed"],
            capacity=jet_info["capacity"],
            hourly_rate=jet_info["hourly_rate"],
            class_type=jet_info["class_type"],
            description=jet_info["description"],
            image_url=jet_info["image_url"]
        )
        db.add(jet)
        await db.flush()

        # Seed amenities
        amenities = [
            "Michelin-starred Catering Available",
            "KA-Band High-Speed Wi-Fi",
            "Private Master Suite",
            "Dedicated Flight Attendant",
            "Enroute Border Pre-clearance"
        ]
        for am in amenities:
            db.add(AircraftAmenity(id=uuid.uuid4(), aircraft_id=jet.id, amenity_text=am))

    # 6. Seed Flight Routes
    routes_data = [
        {"origin_code": "BOM", "destination_code": "DWC", "base_price": 2500.0, "duration": "3h 10m"},
        {"origin_code": "DWC", "destination_code": "JFK", "base_price": 8500.0, "duration": "14h 20m"},
        {"origin_code": "JFK", "destination_code": "LHR", "base_price": 6500.0, "duration": "7h 15m"},
        {"origin_code": "LHR", "destination_code": "SIN", "base_price": 9000.0, "duration": "12h 45m"},
        {"origin_code": "SIN", "destination_code": "BOM", "base_price": 4000.0, "duration": "5h 30m"}
    ]
    routes = []
    for rd in routes_data:
        route = FlightRoute(id=uuid.uuid4(), **rd)
        db.add(route)
        routes.append(route)
    await db.flush()

    # 7. Seed Scheduled Flights for the next 7 days
    now = datetime.utcnow()
    airlines = ["EK", "SQ", "QR"]
    for i in range(15):
        route = routes[i % len(routes)]
        airline = airlines[i % len(airlines)]
        dep = now + timedelta(days=(i // 2) + 1, hours=(i * 3) % 12)
        arr = dep + timedelta(hours=4 if "h" not in route.duration else int(route.duration.split("h")[0]))
        
        flight = Flight(
            id=uuid.uuid4(),
            route_id=route.id,
            origin=route.origin_code,
            destination=route.destination_code,
            departure_time=dep,
            arrival_time=arr,
            base_price=route.base_price,
            airline_code=airline,
            status="Scheduled"
        )
        db.add(flight)

    # 8. Seed Coupons
    coupons_data = [
        {"brand": "Aman Resorts", "offer": "Complimentary Villa Upgrade & $500 Spa Credit", "points_required": 5000, "image_url": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300"},
        {"brand": "Aston Martin", "offer": "24-Hour Supercar Track Experience", "points_required": 8000, "image_url": "https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=300"},
        {"brand": "Royal Oak Manufacture", "offer": "VIP Audemars Piguet Private Tour", "points_required": 12000, "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"}
    ]
    for cp in coupons_data:
        db.add(Coupon(id=uuid.uuid4(), **cp))

    # 9. Seed Destinations
    destinations_data = [
        {
            "name": "Amangiri, Utah",
            "region": "North America",
            "image_url": "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?w=600",
            "overview": "A modernist resort in canyon country, offering spectacular scenery, privacy and extreme luxury.",
            "best_time": "April to October",
            "airport": "Page Municipal Airport (PGA)"
        },
        {
            "name": "St. Moritz, Switzerland",
            "region": "Europe",
            "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
            "overview": "The birthplace of Alpine winter tourism, offering high-end ski resorts, upscale dining and polo on snow.",
            "best_time": "December to March",
            "airport": "Samedan Airport (SMV / LSZS)"
        },
        {
            "name": "Maldives (Private Island)",
            "region": "Asia Pacific",
            "image_url": "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600",
            "overview": "A tropical paradise with turquoise reefs, overwater luxury villas and private white-sand beaches.",
            "best_time": "November to April",
            "airport": "Velana International (MLE)"
        }
    ]
    for dest_info in destinations_data:
        dest = Destination(
            id=uuid.uuid4(),
            name=dest_info["name"],
            region=dest_info["region"],
            image_url=dest_info["image_url"],
            overview=dest_info["overview"],
            best_time=dest_info["best_time"],
            airport=dest_info["airport"]
        )
        db.add(dest)
        await db.flush()

        # Seed guides for the destination
        guides = [
            {"category": "Hotels", "title": "Aman Resorts Private Pavilions", "details": "Unparalleled privacy with plunge pools overlooking desert canyons or deep blue waters."},
            {"category": "Dining", "title": "Michelin Gastronomy Chef Table", "details": "Custom culinary concepts crafted using native ingredients, paired with vintage Grand Cru."},
            {"category": "Experiences", "title": "Private Helicopter Canyon Tour", "details": "Helicopter transfers from the resort helipad directly to exclusive archaeological ruins."}
        ]
        for gd in guides:
            db.add(DestinationGuide(id=uuid.uuid4(), destination_id=dest.id, **gd))

    await db.commit()
    print("Database seeding completed successfully!")

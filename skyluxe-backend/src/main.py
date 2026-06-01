import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
# Also search parent directories to support root-level .env if running from subdirectory
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "../.env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SkyLuxe Enterprise API",
    description="Backend API for SkyLuxe luxury aviation and travel platform.",
    version="1.0.0",
)

# CORS Middleware for Frontend React/Next.js access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "SkyLuxe API Gateway",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected", "redis": "connected"}

from src.services.auth.router import router as auth_router
from src.services.flights.router import router as flights_router
from src.services.booking.router import router as booking_router
from src.services.users.router import router as users_router
from src.services.ai.router import router as ai_router
from src.services.memberships.router import router as memberships_router
from src.services.wallet.router import router as wallet_router
from src.services.rewards.router import router as rewards_router
from src.services.destinations.router import router as destinations_router
from src.services.notifications.router import router as notifications_router
from src.services.dashboard.router import router as dashboard_router

from src.common.database import Base, engine, AsyncSessionLocal
from src.common.seed import seed_database
import src.common.models as models  # Ensure all models are registered on Base.metadata

@app.on_event("startup")
async def startup_event():
    # Automatically create tables in SQLite/PostgreSQL
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Run seed script
    async with AsyncSessionLocal() as db:
        await seed_database(db)

# Mount routers for microservices
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(flights_router, prefix="/api/v1", tags=["Fleet & Flights"])
app.include_router(booking_router, prefix="/api/v1/bookings", tags=["Bookings"])
app.include_router(users_router, prefix="/api/v1/users", tags=["Users"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["Concierge AI"])
app.include_router(memberships_router, prefix="/api/v1/memberships", tags=["Memberships"])
app.include_router(wallet_router, prefix="/api/v1/wallet", tags=["FBO Wallet"])
app.include_router(rewards_router, prefix="/api/v1/rewards", tags=["Rewards & Loyalty"])
app.include_router(destinations_router, prefix="/api/v1/destinations", tags=["Destinations"])
app.include_router(notifications_router, prefix="/api/v1/notifications", tags=["Notifications"])
app.include_router(dashboard_router, prefix="/api/v1/dashboard", tags=["Dashboard"])




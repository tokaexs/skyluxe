import os
from datetime import datetime

MONGO_URL = os.getenv("MONGO_URL", "mongodb://root:rootpassword@localhost:27017")
db = None

try:
    from motor.motor_asyncio import AsyncIOMotorClient
    client = AsyncIOMotorClient(MONGO_URL, serverSelectionTimeoutMS=2000)
    db = client.skyluxe_logs
except Exception:
    print("[WARNING] MongoDB not available. Audit logs will fall back to stdout.")

async def log_event(event_type: str, user_id: str, details: dict):
    """
    Logs an event asynchronously to MongoDB for audit and security tracking.
    """
    log_entry = {
        "event_type": event_type,
        "user_id": user_id,
        "details": details,
        "timestamp": datetime.utcnow()
    }
    if db is not None:
        try:
            await db.audit_logs.insert_one(log_entry)
        except Exception as e:
            print(f"[MONGO LOG ERROR] {e}")
    print(f"[AUDIT LOG] {event_type} for user {user_id}: {details}")

from src.common.worker import celery_app
import time

@celery_app.task
def process_booking_confirmation(booking_id: str, email: str):
    """
    Simulates sending a highly-secure booking confirmation via email.
    """
    # Simulate processing time
    time.sleep(2)
    print(f"[CELERY] Booking {booking_id} confirmation sent to {email}.")
    return {"status": "success", "booking_id": booking_id}

@celery_app.task
def analyze_flight_weather(flight_id: str, origin: str, destination: str):
    """
    Simulates fetching complex global weather intelligence via AI.
    """
    # Simulate processing time
    time.sleep(3)
    print(f"[CELERY] Weather intelligence computed for route {origin} -> {destination}.")
    return {"flight_id": flight_id, "weather_clear": True}

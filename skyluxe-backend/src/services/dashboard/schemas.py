from pydantic import BaseModel
from typing import List, Dict, Any
from uuid import UUID

class DashboardOverviewResponse(BaseModel):
    upcoming_flights_count: int
    active_charters_count: int
    wallet_balance: float
    reward_coins: int
    membership_tier: str
    recent_activities: List[Dict[str, Any]] = []
    monthly_spend: List[float] = []
    spend_labels: List[str] = []

    class Config:
        from_attributes = True

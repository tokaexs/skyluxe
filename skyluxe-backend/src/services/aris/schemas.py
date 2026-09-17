from pydantic import BaseModel
from datetime import date
from typing import List, Optional

class DemandPredictionInput(BaseModel):
    route: str
    passengers: int
    date: date

class DemandPredictionResponse(BaseModel):
    route: str
    predicted_demand_index: int
    confidence: int
    seasonal_factors: List[str]

class PricingOptimizationInput(BaseModel):
    flight_number: str
    current_price: float
    booking_velocity: float # bookings per hour

class PricingOptimizationResponse(BaseModel):
    flight_number: str
    recommended_price: float
    revenue_gain_percent: float
    elasticity: str

class RouteRecommendationInput(BaseModel):
    origin: str
    destination: str

class RouteRecommendationResponse(BaseModel):
    origin: str
    destination: str
    confidence: int
    expected_load_factor: int
    expected_monthly_revenue: float
    reason: str

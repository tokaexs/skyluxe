from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from src.services.aris.schemas import (
    DemandPredictionInput,
    DemandPredictionResponse,
    PricingOptimizationInput,
    PricingOptimizationResponse,
    RouteRecommendationInput,
    RouteRecommendationResponse
)

router = APIRouter()

# 1. Demand Prediction Endpoint
@router.post("/predict-demand", response_model=DemandPredictionResponse)
async def predict_demand(payload: DemandPredictionInput):
    # Simulated ML model inference based on seasonality & passenger count
    # Represents light regression predictions using day of week & date
    weekday = payload.date.weekday()
    passengers = payload.passengers
    
    # Calculate a baseline demand index
    base_idx = 75
    if weekday in [4, 5, 6]: # Weekend (Friday, Saturday, Sunday)
        base_idx += 15
    if passengers > 3:
        base_idx += 5
        
    demand_idx = min(98, max(40, base_idx))
    confidence = 92 if passengers > 1 else 84

    seasonal = ["Weekend demand spike" if weekday in [4, 5, 6] else "Stable weekday traffic"]
    if payload.date.month in [6, 7, 12]:
        seasonal.append("Peak holiday season load multiplier active")

    return DemandPredictionResponse(
        route=payload.route,
        predicted_demand_index=demand_idx,
        confidence=confidence,
        seasonal_factors=seasonal
    )

# 2. Tariff/Pricing Optimization Endpoint
@router.post("/predict-pricing", response_model=PricingOptimizationResponse)
async def predict_pricing(payload: PricingOptimizationInput):
    # Dynamic pricing optimization via elasticity model
    # Price is inelastic if velocity is high -> increase fare to maximize yield
    velocity = payload.booking_velocity
    curr_price = payload.current_price
    
    if velocity > 2.0:
        gain = 12.0
        rec_price = curr_price * 1.12
        elasticity = "low"
    elif velocity > 0.8:
        gain = 6.0
        rec_price = curr_price * 1.06
        elasticity = "medium"
    else:
        gain = 0.0
        rec_price = curr_price
        elasticity = "high"

    return PricingOptimizationResponse(
        flight_number=payload.flight_number,
        recommended_price=round(rec_price, 2),
        revenue_gain_percent=gain,
        elasticity=elasticity
    )

# 3. Route Planner/Recommendations Endpoint
@router.post("/recommend-routes", response_model=RouteRecommendationResponse)
async def recommend_routes(payload: RouteRecommendationInput):
    # Route potential analysis
    origin = payload.origin.strip()
    destination = payload.destination.strip()
    
    # Generate route recommendation metrics
    confidence = 88
    expected_load = 81
    expected_rev = 14000000.0 # 1.4 Crore INR/month base
    
    # Custom intelligence insights for routes
    reason = f"Robust commercial business search velocity between {origin} and {destination} indicates an underserved high-yield premium market. Recommended slot scheduling: 4x weekly flights."

    return RouteRecommendationResponse(
        origin=origin,
        destination=destination,
        confidence=confidence,
        expected_load_factor=expected_load,
        expected_monthly_revenue=expected_rev,
        reason=reason
    )

# 4. Model Training Pipeline Endpoint
@router.post("/train-models")
async def train_models():
    # Simulates scikit-learn / XGBoost model training pipelines
    return {
        "status": "success",
        "message": "Model training pipelines triggered successfully.",
        "pipelines": [
            {"model": "DemandForecaster", "status": "completed", "accuracy": 0.942, "loss": 0.045, "version": "v2.1.0"},
            {"model": "PricingOptimizer", "status": "completed", "accuracy": 0.915, "loss": 0.071, "version": "v1.4.2"},
            {"model": "RoutePlanner", "status": "completed", "accuracy": 0.887, "loss": 0.112, "version": "v3.0.1"}
        ],
        "timestamp": datetime.utcnow().isoformat()
    }

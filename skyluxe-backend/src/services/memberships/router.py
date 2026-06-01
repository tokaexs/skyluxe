from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from uuid import UUID
from datetime import datetime, timedelta

from src.common.database import get_db
from src.common.models import (
    MembershipPlan, MembershipBenefit, UserMembership, 
    MembershipTransaction, MembershipApplication, User, Wallet, WalletTransaction
)
from src.services.memberships.schemas import (
    MembershipPlanResponse, SubscribeRequest, SubscribeResponse,
    ApplicationRequest, ApplicationResponse, MembershipTransactionResponse
)

router = APIRouter()

@router.get("/", response_model=List[MembershipPlanResponse])
async def get_membership_plans(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MembershipPlan))
    plans = result.scalars().all()
    
    response = []
    for plan in plans:
        # Fetch benefits for this plan
        benefit_result = await db.execute(
            select(MembershipBenefit).filter(MembershipBenefit.plan_id == plan.id)
        )
        benefits = [b.benefit_text for b in benefit_result.scalars().all()]
        
        response.append(
            MembershipPlanResponse(
                id=plan.id,
                name=plan.name,
                annual_price=plan.annual_price,
                expected_savings=plan.expected_savings,
                multiplier=plan.multiplier,
                description=plan.description,
                benefits=benefits
            )
        )
    return response

@router.post("/subscribe", response_model=SubscribeResponse)
async def subscribe_to_plan(
    payload: SubscribeRequest, 
    user_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    # Fetch user
    user_result = await db.execute(select(User).filter(User.id == user_id))
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Fetch plan
    plan_result = await db.execute(select(MembershipPlan).filter(MembershipPlan.id == payload.plan_id))
    plan = plan_result.scalars().first()
    if not plan:
        raise HTTPException(status_code=404, detail="Membership plan not found")
        
    # Fetch wallet
    wallet_result = await db.execute(select(Wallet).filter(Wallet.user_id == user.id))
    wallet = wallet_result.scalars().first()
    if not wallet or wallet.balance < plan.annual_price:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient wallet balance. Plan price is ${plan.annual_price:,.2f}"
        )
        
    # Deduct price from wallet
    wallet.balance -= plan.annual_price
    
    # Log transaction in wallet
    wallet_tx = WalletTransaction(
        wallet_id=wallet.id,
        description=f"Purchase of {plan.name.title()} Membership",
        amount=plan.annual_price,
        type="debit"
    )
    db.add(wallet_tx)
    
    # Create or update user membership
    now = datetime.utcnow()
    user_membership_result = await db.execute(
        select(UserMembership).filter(UserMembership.user_id == user.id)
    )
    user_membership = user_membership_result.scalars().first()
    
    if user_membership:
        user_membership.plan_id = plan.id
        user_membership.start_date = now
        user_membership.end_date = now + timedelta(days=365)
    else:
        user_membership = UserMembership(
            user_id=user.id,
            plan_id=plan.id,
            start_date=now,
            end_date=now + timedelta(days=365)
        )
        db.add(user_membership)
        
    # Update user's membership tier
    user.membership_tier = plan.name.lower()
    
    # Log membership transaction
    membership_tx = MembershipTransaction(
        user_id=user.id,
        plan_id=plan.id,
        price_paid=plan.annual_price,
        status="Success"
    )
    db.add(membership_tx)
    
    await db.commit()
    
    return SubscribeResponse(
        status="success",
        message=f"Successfully subscribed to {plan.name.title()} tier.",
        membership_tier=user.membership_tier
    )

@router.post("/apply", response_model=ApplicationResponse)
async def apply_for_membership(
    payload: ApplicationRequest, 
    user_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    # Fetch user
    user_result = await db.execute(select(User).filter(User.id == user_id))
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    new_app = MembershipApplication(
        user_id=user.id,
        proposed_tier=payload.proposed_tier,
        status="Pending"
    )
    db.add(new_app)
    await db.commit()
    await db.refresh(new_app)
    return new_app

@router.get("/transactions", response_model=List[MembershipTransactionResponse])
async def get_membership_transactions(user_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MembershipTransaction)
        .filter(MembershipTransaction.user_id == user_id)
        .order_by(MembershipTransaction.created_at.desc())
    )
    return result.scalars().all()

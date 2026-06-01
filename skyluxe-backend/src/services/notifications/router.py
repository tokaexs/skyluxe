from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from uuid import UUID

from src.common.database import get_db
from src.common.models import Notification, User
from src.services.notifications.schemas import NotificationResponse, NotificationCreate

router = APIRouter()

@router.get("/", response_model=List[NotificationResponse])
async def get_notifications(user_id: UUID, unread_only: bool = False, db: AsyncSession = Depends(get_db)):
    query = select(Notification).filter(Notification.user_id == user_id)
    if unread_only:
        query = query.filter(Notification.unread == True)
        
    query = query.order_by(Notification.created_at.desc())
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/", response_model=NotificationResponse, status_code=status.HTTP_201_CREATED)
async def create_notification(
    payload: NotificationCreate, 
    user_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    # Verify user exists
    user_result = await db.execute(select(User).filter(User.id == user_id))
    if not user_result.scalars().first():
        raise HTTPException(status_code=404, detail="User not found")
        
    new_notif = Notification(
        user_id=user_id,
        title=payload.title,
        message=payload.message,
        type=payload.type,
        unread=True
    )
    db.add(new_notif)
    await db.commit()
    await db.refresh(new_notif)
    return new_notif

@router.post("/{notification_id}/read", response_model=NotificationResponse)
async def mark_notification_as_read(
    notification_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Notification).filter(Notification.id == notification_id))
    notif = result.scalars().first()
    
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    notif.unread = False
    await db.commit()
    await db.refresh(notif)
    return notif

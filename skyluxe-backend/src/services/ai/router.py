from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Dict, List
from uuid import UUID
import asyncio
import json

from src.common.database import get_db
from src.common.models import ConciergeRequest, User
from src.services.ai.schemas import ConciergeRequestCreate, ConciergeRequestResponse

router = APIRouter()


class AIConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        
        # Send initial Jarvis-like greeting
        await websocket.send_json({
            "type": "system",
            "message": "Cortex AI Core Online. Military-grade encryption established.",
            "data": None
        })

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]

    async def generate_ai_response(self, client_id: str, message: str):
        websocket = self.active_connections.get(client_id)
        if not websocket:
            return

        # 1. Simulate "Executing Directives..." loading state
        await websocket.send_json({"type": "status", "message": "Analyzing global airspace...", "status": "processing"})
        await asyncio.sleep(1)
        
        # 2. Simulate complex RAG pipeline/LLM generation
        await websocket.send_json({"type": "status", "message": "Cross-referencing membership privileges...", "status": "processing"})
        await asyncio.sleep(1)

        # 3. Simulate final response
        response = f"I have processed your request: '{message}'. The Gulfstream G650ER is available for immediate deployment. Shall I initiate the booking protocol?"
        
        await websocket.send_json({
            "type": "ai_response",
            "message": response,
            "data": {
                "aircraft": "Gulfstream G650ER",
                "status": "Available",
                "action_required": "confirmation"
            }
        })

manager = AIConnectionManager()

@router.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            # User sent a message to the AI
            await manager.generate_ai_response(client_id, data)
    except WebSocketDisconnect:
        manager.disconnect(client_id)

@router.get("/concierge-requests", response_model=List[ConciergeRequestResponse])
async def get_concierge_requests(user_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ConciergeRequest)
        .filter(ConciergeRequest.user_id == user_id)
        .order_by(ConciergeRequest.created_at.desc())
    )
    return result.scalars().all()

@router.post("/concierge-requests", response_model=ConciergeRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_concierge_request(
    payload: ConciergeRequestCreate, 
    user_id: UUID, 
    db: AsyncSession = Depends(get_db)
):
    user_result = await db.execute(select(User).filter(User.id == user_id))
    if not user_result.scalars().first():
        raise HTTPException(status_code=404, detail="User not found")
        
    req = ConciergeRequest(
        user_id=user_id,
        type=payload.type,
        details=payload.details
    )
    db.add(req)
    await db.commit()
    await db.refresh(req)
    return req


from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from websocket.manager import manager
import uuid
import json
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    connection_id = str(uuid.uuid4())
    
    try:
        await manager.connect(websocket, user_id, connection_id)
        
        # Send welcome message
        await websocket.send_text(json.dumps({
            "type": "connection",
            "message": "Connected to AgriTrust real-time updates",
            "connection_id": connection_id
        }))
        
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Handle different message types
            if message.get("type") == "ping":
                await websocket.send_text(json.dumps({
                    "type": "pong",
                    "timestamp": message.get("timestamp")
                }))
            
    except WebSocketDisconnect:
        manager.disconnect(user_id, connection_id)
        logger.info(f"WebSocket disconnected for user {user_id}")
    except Exception as e:
        logger.error(f"WebSocket error for user {user_id}: {e}")
        manager.disconnect(user_id, connection_id)

# Utility functions for sending notifications
async def notify_batch_update(batch_id: str, producer_id: str, update_data: dict):
    """Notify relevant users about batch updates"""
    message = {
        "type": "batch_updated",
        "batch_id": batch_id,
        "data": update_data
    }
    
    # Notify the producer
    await manager.send_personal_message(message, producer_id)
    
    # Broadcast to all users (for public tracking)
    await manager.broadcast({
        "type": "public_batch_update",
        "batch_id": batch_id,
        "stage": update_data.get("current_stage")
    })

async def notify_quality_assessment(batch_id: str, producer_id: str, assessment_data: dict):
    """Notify about new quality assessments"""
    message = {
        "type": "quality_assessed",
        "batch_id": batch_id,
        "data": assessment_data
    }
    
    await manager.send_personal_message(message, producer_id)

async def notify_producer_verification(producer_id: str, status: str):
    """Notify producer about verification status"""
    message = {
        "type": "producer_verified",
        "status": status,
        "message": f"Your producer application has been {status}"
    }
    
    await manager.send_personal_message(message, producer_id)
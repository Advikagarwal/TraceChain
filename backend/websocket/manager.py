import asyncio
import json
from typing import Dict, Set
from fastapi import WebSocket, WebSocketDisconnect
import logging

logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_connections: Dict[str, Set[str]] = {}

    async def connect(self, websocket: WebSocket, user_id: str, connection_id: str):
        await websocket.accept()
        self.active_connections[connection_id] = websocket
        
        if user_id not in self.user_connections:
            self.user_connections[user_id] = set()
        self.user_connections[user_id].add(connection_id)
        
        logger.info(f"User {user_id} connected with connection {connection_id}")

    def disconnect(self, user_id: str, connection_id: str):
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
        
        if user_id in self.user_connections:
            self.user_connections[user_id].discard(connection_id)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
        
        logger.info(f"User {user_id} disconnected connection {connection_id}")

    async def send_personal_message(self, message: dict, user_id: str):
        """Send message to all connections of a specific user"""
        if user_id in self.user_connections:
            disconnected_connections = []
            
            for connection_id in self.user_connections[user_id]:
                if connection_id in self.active_connections:
                    try:
                        await self.active_connections[connection_id].send_text(
                            json.dumps(message)
                        )
                    except Exception as e:
                        logger.error(f"Error sending message to {connection_id}: {e}")
                        disconnected_connections.append(connection_id)
            
            # Clean up disconnected connections
            for connection_id in disconnected_connections:
                self.disconnect(user_id, connection_id)

    async def broadcast(self, message: dict):
        """Send message to all connected users"""
        disconnected_connections = []
        
        for connection_id, websocket in self.active_connections.items():
            try:
                await websocket.send_text(json.dumps(message))
            except Exception as e:
                logger.error(f"Error broadcasting to {connection_id}: {e}")
                disconnected_connections.append(connection_id)
        
        # Clean up disconnected connections
        for connection_id in disconnected_connections:
            # Find user_id for this connection
            user_id = None
            for uid, connections in self.user_connections.items():
                if connection_id in connections:
                    user_id = uid
                    break
            
            if user_id:
                self.disconnect(user_id, connection_id)

manager = ConnectionManager()
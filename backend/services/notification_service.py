import asyncio
from typing import Dict, Any
from database.connection import get_database
from websocket.manager import manager
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    """Service for managing notifications and real-time updates"""
    
    @staticmethod
    async def create_notification(
        user_id: str,
        title: str,
        message: str,
        notification_type: str = "info"
    ):
        """Create and send a notification to a user"""
        try:
            from database.connection import db
            database = db.database
            
            # Store notification in database
            notification_data = {
                "user_id": user_id,
                "title": title,
                "message": message,
                "type": notification_type,
                "read": False
            }
            
            result = await database.notifications.insert_one(notification_data)
            
            # Send real-time notification
            await manager.send_personal_message({
                "type": "notification",
                "data": {
                    "id": str(result.inserted_id),
                    "title": title,
                    "message": message,
                    "type": notification_type
                }
            }, user_id)
            
            logger.info(f"Notification sent to user {user_id}: {title}")
            
        except Exception as e:
            logger.error(f"Failed to create notification: {e}")
    
    @staticmethod
    async def notify_batch_status_change(
        batch_id: str,
        producer_id: str,
        old_stage: str,
        new_stage: str,
        location: str
    ):
        """Notify about batch status changes"""
        await NotificationService.create_notification(
            user_id=producer_id,
            title="Batch Status Updated",
            message=f"Batch {batch_id} moved from {old_stage} to {new_stage} at {location}",
            notification_type="info"
        )
        
        # Send real-time update
        await manager.send_personal_message({
            "type": "batch_updated",
            "batch_id": batch_id,
            "old_stage": old_stage,
            "new_stage": new_stage,
            "location": location
        }, producer_id)
    
    @staticmethod
    async def notify_quality_assessment_complete(
        batch_id: str,
        producer_id: str,
        quality_score: float
    ):
        """Notify about completed quality assessments"""
        await NotificationService.create_notification(
            user_id=producer_id,
            title="Quality Assessment Complete",
            message=f"Batch {batch_id} received a quality score of {quality_score}/10",
            notification_type="success" if quality_score >= 8.0 else "warning"
        )
    
    @staticmethod
    async def notify_producer_verification(
        producer_id: str,
        status: str,
        reason: str = ""
    ):
        """Notify about producer verification status"""
        title = "Producer Verification Update"
        
        if status == "verified":
            message = "Congratulations! Your producer application has been approved."
            notification_type = "success"
        else:
            message = f"Your producer application was {status}. {reason}"
            notification_type = "warning"
        
        await NotificationService.create_notification(
            user_id=producer_id,
            title=title,
            message=message,
            notification_type=notification_type
        )
    
    @staticmethod
    async def notify_price_alert(
        user_id: str,
        product_type: str,
        current_price: float,
        threshold_price: float,
        alert_type: str
    ):
        """Notify about price alerts"""
        if alert_type == "above":
            message = f"{product_type} price is now ${current_price:.2f}, above your threshold of ${threshold_price:.2f}"
        else:
            message = f"{product_type} price is now ${current_price:.2f}, below your threshold of ${threshold_price:.2f}"
        
        await NotificationService.create_notification(
            user_id=user_id,
            title="Price Alert",
            message=message,
            notification_type="info"
        )
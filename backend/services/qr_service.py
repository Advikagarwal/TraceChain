import qrcode
from io import BytesIO
import base64
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class QRCodeService:
    """Service for generating QR codes for batch tracking"""
    
    def __init__(self):
        self.base_url = "https://tracechain.com/track"  # In production, use actual domain
    
    def generate_batch_qr(self, batch_id: str, format: str = "png") -> Dict[str, Any]:
        """Generate QR code for batch tracking"""
        try:
            # Create tracking URL
            tracking_url = f"{self.base_url}/{batch_id}"
            
            # Generate QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(tracking_url)
            qr.make(fit=True)
            
            # Create QR code image
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Convert to base64 for API response
            buffer = BytesIO()
            img.save(buffer, format=format.upper())
            img_str = base64.b64encode(buffer.getvalue()).decode()
            
            return {
                "batch_id": batch_id,
                "tracking_url": tracking_url,
                "qr_code_data": f"data:image/{format};base64,{img_str}",
                "format": format
            }
            
        except Exception as e:
            logger.error(f"Failed to generate QR code: {e}")
            raise Exception(f"QR code generation failed: {str(e)}")
    
    def generate_producer_qr(self, producer_id: str) -> Dict[str, Any]:
        """Generate QR code for producer profile"""
        try:
            profile_url = f"{self.base_url}/producer/{producer_id}"
            
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            qr.add_data(profile_url)
            qr.make(fit=True)
            
            img = qr.make_image(fill_color="black", back_color="white")
            
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            img_str = base64.b64encode(buffer.getvalue()).decode()
            
            return {
                "producer_id": producer_id,
                "profile_url": profile_url,
                "qr_code_data": f"data:image/png;base64,{img_str}",
                "format": "png"
            }
            
        except Exception as e:
            logger.error(f"Failed to generate producer QR code: {e}")
            raise Exception(f"Producer QR code generation failed: {str(e)}")
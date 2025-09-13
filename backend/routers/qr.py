from fastapi import APIRouter, HTTPException, Depends
from bson import ObjectId

from database.connection import get_database
from services.qr_service import QRCodeService

router = APIRouter()
qr_service = QRCodeService()

@router.get("/batch/{batch_id}")
async def generate_batch_qr(batch_id: str, format: str = "png", db=Depends(get_database)):
    """Generate QR code for batch tracking"""
    try:
        if not ObjectId.is_valid(batch_id):
            raise HTTPException(status_code=400, detail="Invalid batch ID")
        
        # Verify batch exists
        batch = await db.batches.find_one({"_id": ObjectId(batch_id)})
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        qr_data = qr_service.generate_batch_qr(batch_id, format)
        return qr_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/producer/{producer_id}")
async def generate_producer_qr(producer_id: str, db=Depends(get_database)):
    """Generate QR code for producer profile"""
    try:
        if not ObjectId.is_valid(producer_id):
            raise HTTPException(status_code=400, detail="Invalid producer ID")
        
        # Verify producer exists
        producer = await db.producers.find_one({"_id": ObjectId(producer_id)})
        if not producer:
            raise HTTPException(status_code=404, detail="Producer not found")
        
        qr_data = qr_service.generate_producer_qr(producer_id)
        return qr_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
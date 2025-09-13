from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from typing import List, Optional
from bson import ObjectId
from datetime import datetime, timedelta

from models.certification import Certification, CertificationCreate, CertificationUpdate
from database.connection import get_database

router = APIRouter()

@router.post("/", response_model=Certification, status_code=status.HTTP_201_CREATED)
async def create_certification(
    certification: CertificationCreate, 
    document: Optional[UploadFile] = File(None),
    db=Depends(get_database)
):
    """Create a new certification"""
    try:
        certification_dict = certification.dict()
        certification_dict["created_at"] = datetime.utcnow()
        certification_dict["status"] = "pending"
        
        # Handle document upload if provided
        if document:
            # In production, upload to cloud storage (S3, etc.)
            certification_dict["document_url"] = f"/uploads/certifications/{document.filename}"
        
        result = await db.certifications.insert_one(certification_dict)
        created_certification = await db.certifications.find_one({"_id": result.inserted_id})
        
        return Certification(**created_certification)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/producer/{producer_id}", response_model=List[Certification])
async def get_producer_certifications(producer_id: str, db=Depends(get_database)):
    """Get all certifications for a producer"""
    try:
        if not ObjectId.is_valid(producer_id):
            raise HTTPException(status_code=400, detail="Invalid producer ID")
        
        cursor = db.certifications.find({"producer_id": producer_id}).sort("created_at", -1)
        certifications = await cursor.to_list(length=None)
        return [Certification(**cert) for cert in certifications]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{certification_id}", response_model=Certification)
async def update_certification(
    certification_id: str, 
    certification_update: CertificationUpdate, 
    db=Depends(get_database)
):
    """Update a certification"""
    try:
        if not ObjectId.is_valid(certification_id):
            raise HTTPException(status_code=400, detail="Invalid certification ID")
        
        update_data = {k: v for k, v in certification_update.dict().items() if v is not None}
        update_data["updated_at"] = datetime.utcnow()
        
        result = await db.certifications.update_one(
            {"_id": ObjectId(certification_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Certification not found")
        
        updated_certification = await db.certifications.find_one({"_id": ObjectId(certification_id)})
        return Certification(**updated_certification)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{certification_id}/verify")
async def verify_certification(certification_id: str, db=Depends(get_database)):
    """Verify a certification (admin only)"""
    try:
        if not ObjectId.is_valid(certification_id):
            raise HTTPException(status_code=400, detail="Invalid certification ID")
        
        result = await db.certifications.update_one(
            {"_id": ObjectId(certification_id)},
            {"$set": {"status": "verified", "verified_at": datetime.utcnow()}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Certification not found")
        
        return {"message": "Certification verified successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/expiring", response_model=List[Certification])
async def get_expiring_certifications(days: int = 30, db=Depends(get_database)):
    """Get certifications expiring within specified days"""
    try:
        expiry_threshold = datetime.utcnow() + timedelta(days=days)
        
        cursor = db.certifications.find({
            "expiry_date": {"$lte": expiry_threshold},
            "status": "verified"
        }).sort("expiry_date", 1)
        
        certifications = await cursor.to_list(length=None)
        return [Certification(**cert) for cert in certifications]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, status
from typing import Optional
from bson import ObjectId
import io
from PIL import Image
import random

from models.quality import QualityAssessment, QualityAssessmentCreate, ImageAnalysis
from database.connection import get_database
from services.ai_quality_service import AIQualityService

router = APIRouter()
ai_service = AIQualityService()

@router.post("/assess/{batch_id}", response_model=QualityAssessment, status_code=status.HTTP_201_CREATED)
async def assess_quality(
    batch_id: str,
    image: UploadFile = File(...),
    db=Depends(get_database)
):
    """Assess quality of a batch using AI image analysis"""
    try:
        if not ObjectId.is_valid(batch_id):
            raise HTTPException(status_code=400, detail="Invalid batch ID")
        
        # Verify batch exists
        batch = await db.batches.find_one({"_id": ObjectId(batch_id)})
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        # Validate image file
        if not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image data
        image_data = await image.read()
        
        # Process image with AI service
        assessment_result = await ai_service.analyze_image(image_data)
        
        # Create quality assessment
        quality_data = {
            "batch_id": batch_id,
            "overall_score": assessment_result["overall_score"],
            "freshness": assessment_result["freshness"],
            "appearance": assessment_result["appearance"],
            "size": assessment_result["size"],
            "defects": assessment_result["defects"],
            "ai_confidence": assessment_result["confidence"],
            "image_analysis": assessment_result["analysis"]
        }
        
        # Save to database
        result = await db.quality_assessments.insert_one(quality_data)
        created_assessment = await db.quality_assessments.find_one({"_id": result.inserted_id})
        
        # Update batch quality score
        await db.batches.update_one(
            {"_id": ObjectId(batch_id)},
            {"$set": {"quality_score": assessment_result["overall_score"]}}
        )
        
        return QualityAssessment(**created_assessment)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/batch/{batch_id}", response_model=QualityAssessment)
async def get_quality_assessment(batch_id: str, db=Depends(get_database)):
    """Get quality assessment for a batch"""
    try:
        if not ObjectId.is_valid(batch_id):
            raise HTTPException(status_code=400, detail="Invalid batch ID")
        
        assessment = await db.quality_assessments.find_one({"batch_id": batch_id})
        if not assessment:
            raise HTTPException(status_code=404, detail="Quality assessment not found")
        
        return QualityAssessment(**assessment)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
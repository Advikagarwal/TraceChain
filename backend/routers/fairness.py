from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict, Any
from bson import ObjectId

from models.fairness import FairnessAssessment, FairnessAssessmentCreate
from database.connection import get_database

router = APIRouter()

@router.post("/assess/{producer_id}", response_model=FairnessAssessment, status_code=status.HTTP_201_CREATED)
async def assess_fairness(
    producer_id: str,
    assessment_data: Dict[str, Any],
    db=Depends(get_database)
):
    """Assess fairness of a producer"""
    try:
        if not ObjectId.is_valid(producer_id):
            raise HTTPException(status_code=400, detail="Invalid producer ID")
        
        # Verify producer exists
        producer = await db.producers.find_one({"_id": ObjectId(producer_id)})
        if not producer:
            raise HTTPException(status_code=404, detail="Producer not found")
        
        # Calculate overall score
        scores = [
            assessment_data.get("labor_conditions", 0),
            assessment_data.get("wage_equity", 0),
            assessment_data.get("environmental_impact", 0),
            assessment_data.get("community_benefit", 0)
        ]
        overall_score = sum(scores) / len(scores)
        
        # Create fairness assessment
        fairness_data = {
            "producer_id": producer_id,
            "labor_conditions": assessment_data.get("labor_conditions", 0),
            "wage_equity": assessment_data.get("wage_equity", 0),
            "environmental_impact": assessment_data.get("environmental_impact", 0),
            "community_benefit": assessment_data.get("community_benefit", 0),
            "overall_score": overall_score,
            "verification_method": assessment_data.get("verification_method", "Third-party audit"),
            "recommendations": assessment_data.get("recommendations", [])
        }
        
        # Save to database
        result = await db.fairness_assessments.insert_one(fairness_data)
        created_assessment = await db.fairness_assessments.find_one({"_id": result.inserted_id})
        
        # Update producer fairness score
        await db.producers.update_one(
            {"_id": ObjectId(producer_id)},
            {"$set": {"fairness_score": overall_score}}
        )
        
        return FairnessAssessment(**created_assessment)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/producer/{producer_id}", response_model=FairnessAssessment)
async def get_fairness_assessment(producer_id: str, db=Depends(get_database)):
    """Get fairness assessment for a producer"""
    try:
        if not ObjectId.is_valid(producer_id):
            raise HTTPException(status_code=400, detail="Invalid producer ID")
        
        assessment = await db.fairness_assessments.find_one(
            {"producer_id": producer_id},
            sort=[("assessment_date", -1)]
        )
        if not assessment:
            raise HTTPException(status_code=404, detail="Fairness assessment not found")
        
        return FairnessAssessment(**assessment)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
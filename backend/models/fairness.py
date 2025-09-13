from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from .producer import PyObjectId

class FairnessAssessmentBase(BaseModel):
    producer_id: str
    labor_conditions: float = Field(..., ge=0, le=10)
    wage_equity: float = Field(..., ge=0, le=10)
    environmental_impact: float = Field(..., ge=0, le=10)
    community_benefit: float = Field(..., ge=0, le=10)
    verification_method: str = Field(..., min_length=5, max_length=100)

class FairnessAssessmentCreate(FairnessAssessmentBase):
    pass

class FairnessAssessment(FairnessAssessmentBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    overall_score: float = Field(default=0.0)
    assessment_date: datetime = Field(default_factory=datetime.utcnow)
    recommendations: List[str] = Field(default_factory=list)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "producer_id": "507f1f77bcf86cd799439011",
                "labor_conditions": 9.5,
                "wage_equity": 9.0,
                "environmental_impact": 9.3,
                "community_benefit": 8.8,
                "overall_score": 9.15,
                "verification_method": "Third-party audit",
                "recommendations": ["Continue current practices", "Consider renewable energy"]
            }
        }
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from .producer import PyObjectId

class ImageAnalysis(BaseModel):
    detected_issues: List[str] = Field(default_factory=list)
    recommendations: List[str] = Field(default_factory=list)

class QualityAssessmentBase(BaseModel):
    batch_id: str
    overall_score: float = Field(..., ge=0, le=10)
    freshness: float = Field(..., ge=0, le=10)
    appearance: float = Field(..., ge=0, le=10)
    size: float = Field(..., ge=0, le=10)
    defects: float = Field(..., ge=0, le=10)
    ai_confidence: float = Field(..., ge=0, le=1)

class QualityAssessmentCreate(QualityAssessmentBase):
    pass

class QualityAssessment(QualityAssessmentBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    assessment_date: datetime = Field(default_factory=datetime.utcnow)
    image_analysis: ImageAnalysis = Field(default_factory=ImageAnalysis)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "batch_id": "507f1f77bcf86cd799439011",
                "overall_score": 9.2,
                "freshness": 9.5,
                "appearance": 9.0,
                "size": 8.8,
                "defects": 9.3,
                "ai_confidence": 0.95,
                "image_analysis": {
                    "detected_issues": ["Minor surface blemishes"],
                    "recommendations": ["Store in cool, dry place"]
                }
            }
        }
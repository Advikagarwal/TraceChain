from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from bson import ObjectId
from .producer import PyObjectId

class CertificationBase(BaseModel):
    producer_id: str
    name: str = Field(..., min_length=2, max_length=100)
    issuing_body: str = Field(..., min_length=2, max_length=100)
    issue_date: datetime
    expiry_date: datetime
    description: Optional[str] = None
    document_url: Optional[str] = None

class CertificationCreate(CertificationBase):
    pass

class CertificationUpdate(BaseModel):
    name: Optional[str] = None
    issuing_body: Optional[str] = None
    issue_date: Optional[datetime] = None
    expiry_date: Optional[datetime] = None
    description: Optional[str] = None
    document_url: Optional[str] = None
    status: Optional[str] = None

class Certification(CertificationBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    status: str = Field(default="pending")  # pending, verified, expired, rejected
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: Optional[datetime] = None
    verified_at: Optional[datetime] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "producer_id": "507f1f77bcf86cd799439011",
                "name": "USDA Organic",
                "issuing_body": "United States Department of Agriculture",
                "issue_date": "2023-01-15T00:00:00Z",
                "expiry_date": "2025-01-15T00:00:00Z",
                "description": "Certified organic farming practices",
                "status": "verified"
            }
        }
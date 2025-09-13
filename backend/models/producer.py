from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

class ProducerBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    location: str = Field(..., min_length=5, max_length=200)
    description: str = Field(..., min_length=20, max_length=1000)
    farm_size: float = Field(..., gt=0)
    certifications: List[str] = Field(..., min_items=1)
    sustainability_practices: List[str] = Field(..., min_items=1)
    wallet_address: Optional[str] = None

class ProducerCreate(ProducerBase):
    pass

class ProducerUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    farm_size: Optional[float] = None
    certifications: Optional[List[str]] = None
    sustainability_practices: Optional[List[str]] = None
    wallet_address: Optional[str] = None

class Producer(ProducerBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    verification_status: str = Field(default="pending")
    fairness_score: float = Field(default=0.0)
    quality_score: float = Field(default=0.0)
    total_batches: int = Field(default=0)
    joined_date: datetime = Field(default_factory=datetime.utcnow)
    avatar: Optional[str] = None

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "name": "Green Valley Farm",
                "location": "Sonoma County, California",
                "description": "A family-owned organic farm committed to sustainable agriculture",
                "farm_size": 150.0,
                "certifications": ["USDA Organic", "Fair Trade Certified"],
                "sustainability_practices": ["Water Conservation", "Soil Health Management"],
                "verification_status": "verified",
                "fairness_score": 9.2,
                "quality_score": 8.8,
                "total_batches": 47
            }
        }
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from bson import ObjectId
from .producer import PyObjectId

class SupplyChainEvent(BaseModel):
    stage: str
    timestamp: datetime
    location: str
    actor: str
    description: str
    verified: bool = False
    transaction_hash: Optional[str] = None

class BatchBase(BaseModel):
    producer_id: str
    product_type: str = Field(..., min_length=2, max_length=100)
    quantity: float = Field(..., gt=0)
    harvest_date: datetime
    location: str = Field(..., min_length=5, max_length=200)
    description: Optional[str] = None
    image_url: Optional[str] = None

class BatchCreate(BatchBase):
    pass

class BatchUpdate(BaseModel):
    product_type: Optional[str] = None
    quantity: Optional[float] = None
    harvest_date: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    current_stage: Optional[str] = None

class Batch(BatchBase):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    token_id: Optional[int] = None
    quality_score: float = Field(default=0.0)
    fairness_score: float = Field(default=0.0)
    certifications: List[str] = Field(default_factory=list)
    current_stage: str = Field(default="harvested")
    supply_chain: List[SupplyChainEvent] = Field(default_factory=list)
    price: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
        schema_extra = {
            "example": {
                "producer_id": "507f1f77bcf86cd799439011",
                "product_type": "Organic Tomatoes",
                "quantity": 500.0,
                "harvest_date": "2024-01-15T08:00:00Z",
                "location": "Green Valley Farm, California",
                "description": "Premium organic tomatoes grown with sustainable practices",
                "quality_score": 9.2,
                "fairness_score": 9.5,
                "current_stage": "harvested"
            }
        }
from fastapi import APIRouter, HTTPException, Depends, status
from typing import List
from bson import ObjectId
from datetime import datetime

from models.producer import Producer, ProducerCreate, ProducerUpdate
from database.connection import get_database

router = APIRouter()

@router.post("/", response_model=Producer, status_code=status.HTTP_201_CREATED)
async def create_producer(producer: ProducerCreate, db=Depends(get_database)):
    """Create a new producer"""
    try:
        producer_dict = producer.dict()
        producer_dict["joined_date"] = datetime.utcnow()
        producer_dict["verification_status"] = "pending"
        producer_dict["fairness_score"] = 0.0
        producer_dict["quality_score"] = 0.0
        producer_dict["total_batches"] = 0
        
        result = await db.producers.insert_one(producer_dict)
        created_producer = await db.producers.find_one({"_id": result.inserted_id})
        
        return Producer(**created_producer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Producer])
async def get_producers(skip: int = 0, limit: int = 100, db=Depends(get_database)):
    """Get all producers with pagination"""
    try:
        cursor = db.producers.find().skip(skip).limit(limit)
        producers = await cursor.to_list(length=limit)
        return [Producer(**producer) for producer in producers]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{producer_id}", response_model=Producer)
async def get_producer(producer_id: str, db=Depends(get_database)):
    """Get a specific producer by ID"""
    try:
        if not ObjectId.is_valid(producer_id):
            raise HTTPException(status_code=400, detail="Invalid producer ID")
        
        producer = await db.producers.find_one({"_id": ObjectId(producer_id)})
        if not producer:
            raise HTTPException(status_code=404, detail="Producer not found")
        
        return Producer(**producer)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{producer_id}", response_model=Producer)
async def update_producer(producer_id: str, producer_update: ProducerUpdate, db=Depends(get_database)):
    """Update a producer"""
    try:
        if not ObjectId.is_valid(producer_id):
            raise HTTPException(status_code=400, detail="Invalid producer ID")
        
        update_data = {k: v for k, v in producer_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        result = await db.producers.update_one(
            {"_id": ObjectId(producer_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Producer not found")
        
        updated_producer = await db.producers.find_one({"_id": ObjectId(producer_id)})
        return Producer(**updated_producer)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{producer_id}/verify")
async def verify_producer(producer_id: str, db=Depends(get_database)):
    """Verify a producer (admin only)"""
    try:
        if not ObjectId.is_valid(producer_id):
            raise HTTPException(status_code=400, detail="Invalid producer ID")
        
        result = await db.producers.update_one(
            {"_id": ObjectId(producer_id)},
            {"$set": {"verification_status": "verified"}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Producer not found")
        
        return {"message": "Producer verified successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{producer_id}")
async def delete_producer(producer_id: str, db=Depends(get_database)):
    """Delete a producer"""
    try:
        if not ObjectId.is_valid(producer_id):
            raise HTTPException(status_code=400, detail="Invalid producer ID")
        
        result = await db.producers.delete_one({"_id": ObjectId(producer_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Producer not found")
        
        return {"message": "Producer deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
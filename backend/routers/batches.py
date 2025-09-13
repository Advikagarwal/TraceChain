from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

from models.batch import Batch, BatchCreate, BatchUpdate, SupplyChainEvent
from database.connection import get_database

router = APIRouter()

@router.post("/", response_model=Batch, status_code=status.HTTP_201_CREATED)
async def create_batch(batch: BatchCreate, db=Depends(get_database)):
    """Create a new batch"""
    try:
        # Verify producer exists
        if not ObjectId.is_valid(batch.producer_id):
            raise HTTPException(status_code=400, detail="Invalid producer ID")
        
        producer = await db.producers.find_one({"_id": ObjectId(batch.producer_id)})
        if not producer:
            raise HTTPException(status_code=404, detail="Producer not found")
        
        batch_dict = batch.dict()
        batch_dict["created_at"] = datetime.utcnow()
        batch_dict["current_stage"] = "harvested"
        batch_dict["quality_score"] = 0.0
        batch_dict["fairness_score"] = 0.0
        batch_dict["certifications"] = []
        
        # Add initial supply chain event
        initial_event = SupplyChainEvent(
            stage="harvested",
            timestamp=datetime.utcnow(),
            location=batch.location,
            actor=producer["name"],
            description=f"Batch harvested at {batch.location}",
            verified=True
        )
        batch_dict["supply_chain"] = [initial_event.dict()]
        
        result = await db.batches.insert_one(batch_dict)
        created_batch = await db.batches.find_one({"_id": result.inserted_id})
        
        # Update producer's total batches
        await db.producers.update_one(
            {"_id": ObjectId(batch.producer_id)},
            {"$inc": {"total_batches": 1}}
        )
        
        return Batch(**created_batch)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[Batch])
async def get_batches(
    skip: int = 0, 
    limit: int = 100, 
    producer_id: Optional[str] = None,
    product_type: Optional[str] = None,
    db=Depends(get_database)
):
    """Get all batches with optional filtering"""
    try:
        query = {}
        
        if producer_id:
            if not ObjectId.is_valid(producer_id):
                raise HTTPException(status_code=400, detail="Invalid producer ID")
            query["producer_id"] = producer_id
        
        if product_type:
            query["product_type"] = {"$regex": product_type, "$options": "i"}
        
        cursor = db.batches.find(query).skip(skip).limit(limit).sort("created_at", -1)
        batches = await cursor.to_list(length=limit)
        return [Batch(**batch) for batch in batches]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{batch_id}", response_model=Batch)
async def get_batch(batch_id: str, db=Depends(get_database)):
    """Get a specific batch by ID"""
    try:
        if not ObjectId.is_valid(batch_id):
            raise HTTPException(status_code=400, detail="Invalid batch ID")
        
        batch = await db.batches.find_one({"_id": ObjectId(batch_id)})
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        return Batch(**batch)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/token/{token_id}", response_model=Batch)
async def get_batch_by_token(token_id: int, db=Depends(get_database)):
    """Get a batch by NFT token ID"""
    try:
        batch = await db.batches.find_one({"token_id": token_id})
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found for token ID")
        
        return Batch(**batch)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{batch_id}", response_model=Batch)
async def update_batch(batch_id: str, batch_update: BatchUpdate, db=Depends(get_database)):
    """Update a batch"""
    try:
        if not ObjectId.is_valid(batch_id):
            raise HTTPException(status_code=400, detail="Invalid batch ID")
        
        update_data = {k: v for k, v in batch_update.dict().items() if v is not None}
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No valid fields to update")
        
        result = await db.batches.update_one(
            {"_id": ObjectId(batch_id)},
            {"$set": update_data}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        updated_batch = await db.batches.find_one({"_id": ObjectId(batch_id)})
        return Batch(**updated_batch)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{batch_id}/stage")
async def update_batch_stage(
    batch_id: str,
    stage: str,
    location: str,
    description: str,
    actor: Optional[str] = "System",
    db=Depends(get_database)
):
    """Update batch supply chain stage"""
    try:
        if not ObjectId.is_valid(batch_id):
            raise HTTPException(status_code=400, detail="Invalid batch ID")
        
        batch = await db.batches.find_one({"_id": ObjectId(batch_id)})
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        # Create new supply chain event
        new_event = SupplyChainEvent(
            stage=stage,
            timestamp=datetime.utcnow(),
            location=location,
            actor=actor,
            description=description,
            verified=True
        )
        
        # Update batch
        result = await db.batches.update_one(
            {"_id": ObjectId(batch_id)},
            {
                "$set": {"current_stage": stage},
                "$push": {"supply_chain": new_event.dict()}
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        return {"message": "Batch stage updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
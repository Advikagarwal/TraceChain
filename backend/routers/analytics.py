from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from bson import ObjectId
from datetime import datetime, timedelta

from database.connection import get_database

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_stats(db=Depends(get_database)):
    """Get dashboard statistics"""
    try:
        # Get total counts
        total_batches = await db.batches.count_documents({})
        total_producers = await db.producers.count_documents({})
        verified_producers = await db.producers.count_documents({"verification_status": "verified"})
        
        # Calculate average scores
        quality_pipeline = [
            {"$group": {"_id": None, "avg_quality": {"$avg": "$quality_score"}}}
        ]
        quality_result = await db.batches.aggregate(quality_pipeline).to_list(1)
        avg_quality = quality_result[0]["avg_quality"] if quality_result else 0
        
        fairness_pipeline = [
            {"$group": {"_id": None, "avg_fairness": {"$avg": "$fairness_score"}}}
        ]
        fairness_result = await db.producers.aggregate(fairness_pipeline).to_list(1)
        avg_fairness = fairness_result[0]["avg_fairness"] if fairness_result else 0
        
        # Recent activity
        recent_batches = await db.batches.find().sort("created_at", -1).limit(5).to_list(5)
        
        return {
            "total_batches": total_batches,
            "total_producers": total_producers,
            "verified_producers": verified_producers,
            "avg_quality_score": round(avg_quality, 1) if avg_quality else 0,
            "avg_fairness_score": round(avg_fairness, 1) if avg_fairness else 0,
            "recent_batches": recent_batches
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/producer/{producer_id}")
async def get_producer_stats(producer_id: str, db=Depends(get_database)):
    """Get statistics for a specific producer"""
    try:
        if not ObjectId.is_valid(producer_id):
            raise HTTPException(status_code=400, detail="Invalid producer ID")
        
        # Get producer
        producer = await db.producers.find_one({"_id": ObjectId(producer_id)})
        if not producer:
            raise HTTPException(status_code=404, detail="Producer not found")
        
        # Get producer's batches
        batches = await db.batches.find({"producer_id": producer_id}).to_list(None)
        
        # Calculate statistics
        total_quantity = sum(batch.get("quantity", 0) for batch in batches)
        avg_quality = sum(batch.get("quality_score", 0) for batch in batches) / len(batches) if batches else 0
        
        # Stage distribution
        stage_counts = {}
        for batch in batches:
            stage = batch.get("current_stage", "unknown")
            stage_counts[stage] = stage_counts.get(stage, 0) + 1
        
        return {
            "producer_id": producer_id,
            "total_batches": len(batches),
            "total_quantity": total_quantity,
            "avg_quality_score": round(avg_quality, 1),
            "stage_distribution": stage_counts,
            "recent_batches": batches[-5:] if batches else []
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/market-trends")
async def get_market_trends(db=Depends(get_database)):
    """Get market trends and analytics"""
    try:
        # Get batch creation trends (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        
        daily_pipeline = [
            {"$match": {"created_at": {"$gte": thirty_days_ago}}},
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": "$created_at"
                        }
                    },
                    "count": {"$sum": 1},
                    "avg_quality": {"$avg": "$quality_score"}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        
        daily_stats = await db.batches.aggregate(daily_pipeline).to_list(None)
        
        # Product type distribution
        product_pipeline = [
            {
                "$group": {
                    "_id": "$product_type",
                    "count": {"$sum": 1},
                    "avg_quality": {"$avg": "$quality_score"}
                }
            },
            {"$sort": {"count": -1}},
            {"$limit": 10}
        ]
        
        product_stats = await db.batches.aggregate(product_pipeline).to_list(10)
        
        return {
            "daily_trends": daily_stats,
            "product_distribution": product_stats,
            "total_value_locked": 0,  # Would calculate from actual blockchain data
            "active_supply_chains": len(daily_stats)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
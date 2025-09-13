from fastapi import APIRouter, HTTPException, Depends, status
from typing import Dict, Any
from bson import ObjectId

from database.connection import get_database
from services.blockchain_service import BlockchainService

router = APIRouter()
blockchain_service = BlockchainService()

@router.post("/mint")
async def mint_nft(batch_data: Dict[str, Any], db=Depends(get_database)):
    """Mint NFT for a batch"""
    try:
        batch_id = batch_data.get("batch_id")
        if not batch_id or not ObjectId.is_valid(batch_id):
            raise HTTPException(status_code=400, detail="Invalid batch ID")
        
        # Verify batch exists
        batch = await db.batches.find_one({"_id": ObjectId(batch_id)})
        if not batch:
            raise HTTPException(status_code=404, detail="Batch not found")
        
        # Mint NFT
        result = await blockchain_service.mint_batch_nft(batch)
        
        # Update batch with token ID
        if result.get("success"):
            await db.batches.update_one(
                {"_id": ObjectId(batch_id)},
                {"$set": {"token_id": result["token_id"]}}
            )
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/token/{token_id}")
async def get_token_info(token_id: int, db=Depends(get_database)):
    """Get blockchain token information"""
    try:
        token_info = await blockchain_service.get_token_info(token_id)
        return token_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/verify/{tx_hash}")
async def verify_transaction(tx_hash: str, db=Depends(get_database)):
    """Verify a blockchain transaction"""
    try:
        verification = await blockchain_service.verify_transaction(tx_hash)
        return verification
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
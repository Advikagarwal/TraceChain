from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List
from datetime import datetime, timedelta
import random

from database.connection import get_database
from services.pricing_service import PricingService

router = APIRouter()
pricing_service = PricingService()

@router.get("/{product_type}")
async def get_current_price(product_type: str, db=Depends(get_database)):
    """Get current price for a product type"""
    try:
        price_data = await pricing_service.get_current_price(product_type)
        return price_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_type}/forecast")
async def get_price_forecast(product_type: str, days: int = 30, db=Depends(get_database)):
    """Get price forecast for a product type"""
    try:
        forecast_data = await pricing_service.get_price_forecast(product_type, days)
        return forecast_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{product_type}/history")
async def get_price_history(product_type: str, period: str = "30d", db=Depends(get_database)):
    """Get price history for a product type"""
    try:
        history_data = await pricing_service.get_price_history(product_type, period)
        return history_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trends/market")
async def get_market_trends(db=Depends(get_database)):
    """Get overall market trends"""
    try:
        trends = await pricing_service.get_market_trends()
        return trends
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
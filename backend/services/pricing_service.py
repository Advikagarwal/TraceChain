import random
from datetime import datetime, timedelta
from typing import Dict, Any, List
import logging

logger = logging.getLogger(__name__)

class PricingService:
    """Service for agricultural product pricing and forecasting"""
    
    def __init__(self):
        # Base prices for different product types (USD per kg)
        self.base_prices = {
            "tomatoes": 4.50,
            "organic tomatoes": 6.75,
            "carrots": 3.25,
            "organic carrots": 4.80,
            "lettuce": 2.90,
            "organic lettuce": 4.20,
            "apples": 5.20,
            "organic apples": 7.40,
            "eggs": 6.25,
            "free-range eggs": 8.50,
            "milk": 3.80,
            "organic milk": 5.60
        }
    
    async def get_current_price(self, product_type: str) -> Dict[str, Any]:
        """Get current price for a product type"""
        try:
            product_key = product_type.lower()
            base_price = self.base_prices.get(product_key, 5.00)
            
            # Add market volatility (±15%)
            volatility = random.uniform(-0.15, 0.15)
            current_price = base_price * (1 + volatility)
            
            # Generate price change percentage
            price_change = random.uniform(-5.0, 8.0)
            
            return {
                "product_type": product_type,
                "current_price": round(current_price, 2),
                "price_change_24h": round(price_change, 1),
                "currency": "USD",
                "unit": "per kg",
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get current price: {e}")
            raise Exception(f"Price lookup failed: {str(e)}")
    
    async def get_price_forecast(self, product_type: str, days: int = 30) -> Dict[str, Any]:
        """Get price forecast for a product type"""
        try:
            current_price_data = await self.get_current_price(product_type)
            current_price = current_price_data["current_price"]
            
            forecast = []
            price = current_price
            
            for i in range(1, days + 1):
                # Simulate price movement with trend and randomness
                trend = random.uniform(-0.02, 0.03)  # Slight upward bias
                daily_change = random.uniform(-0.05, 0.05)  # Daily volatility
                
                price = price * (1 + trend + daily_change)
                confidence = max(0.5, 1.0 - (i * 0.01))  # Decreasing confidence over time
                
                forecast_date = datetime.utcnow() + timedelta(days=i)
                forecast.append({
                    "date": forecast_date.strftime("%Y-%m-%d"),
                    "predicted_price": round(price, 2),
                    "confidence": round(confidence, 2)
                })
            
            # Determine overall trend
            final_price = forecast[-1]["predicted_price"]
            trend_direction = "up" if final_price > current_price else "down"
            trend_percentage = abs((final_price - current_price) / current_price * 100)
            
            return {
                "product_type": product_type,
                "current_price": current_price,
                "forecast_period": f"{days} days",
                "forecast": forecast,
                "trend": {
                    "direction": trend_direction,
                    "percentage": round(trend_percentage, 1),
                    "factors": [
                        "Seasonal demand patterns",
                        "Weather conditions",
                        "Supply chain efficiency",
                        "Market competition"
                    ]
                }
            }
            
        except Exception as e:
            logger.error(f"Failed to generate price forecast: {e}")
            raise Exception(f"Price forecast failed: {str(e)}")
    
    async def get_price_history(self, product_type: str, period: str = "30d") -> Dict[str, Any]:
        """Get price history for a product type"""
        try:
            # Parse period
            if period.endswith('d'):
                days = int(period[:-1])
            elif period.endswith('m'):
                days = int(period[:-1]) * 30
            else:
                days = 30
            
            current_price_data = await self.get_current_price(product_type)
            current_price = current_price_data["current_price"]
            
            history = []
            price = current_price
            
            # Generate historical data (working backwards)
            for i in range(days, 0, -1):
                # Simulate historical price movement
                daily_change = random.uniform(-0.03, 0.03)
                price = price * (1 + daily_change)
                
                history_date = datetime.utcnow() - timedelta(days=i)
                history.append({
                    "date": history_date.strftime("%Y-%m-%d"),
                    "price": round(price, 2)
                })
            
            # Add current price
            history.append({
                "date": datetime.utcnow().strftime("%Y-%m-%d"),
                "price": current_price
            })
            
            return {
                "product_type": product_type,
                "period": period,
                "price_history": history,
                "min_price": round(min(h["price"] for h in history), 2),
                "max_price": round(max(h["price"] for h in history), 2),
                "avg_price": round(sum(h["price"] for h in history) / len(history), 2)
            }
            
        except Exception as e:
            logger.error(f"Failed to get price history: {e}")
            raise Exception(f"Price history lookup failed: {str(e)}")
    
    async def get_market_trends(self) -> Dict[str, Any]:
        """Get overall market trends"""
        try:
            trends = {}
            
            for product, base_price in self.base_prices.items():
                price_data = await self.get_current_price(product)
                trends[product] = {
                    "current_price": price_data["current_price"],
                    "change_24h": price_data["price_change_24h"],
                    "trend": "up" if price_data["price_change_24h"] > 0 else "down"
                }
            
            # Calculate market summary
            all_changes = [trends[p]["change_24h"] for p in trends]
            avg_change = sum(all_changes) / len(all_changes)
            
            return {
                "market_summary": {
                    "average_change": round(avg_change, 1),
                    "trending_up": len([c for c in all_changes if c > 0]),
                    "trending_down": len([c for c in all_changes if c < 0]),
                    "stable": len([c for c in all_changes if abs(c) < 1.0])
                },
                "product_trends": trends,
                "last_updated": datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Failed to get market trends: {e}")
            raise Exception(f"Market trends lookup failed: {str(e)}")
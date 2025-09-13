import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
import logging

logger = logging.getLogger(__name__)

class Database:
    client: AsyncIOMotorClient = None
    database = None

db = Database()

async def connect_to_mongo():
    """Create database connection"""
    try:
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        db_name = os.getenv("DATABASE_NAME", "agritrust")
        
        db.client = AsyncIOMotorClient(mongodb_url)
        db.database = db.client[db_name]
        
        # Test the connection
        await db.client.admin.command('ping')
        logger.info(f"Connected to MongoDB at {mongodb_url}")
        
    except ConnectionFailure as e:
        logger.error(f"Could not connect to MongoDB: {e}")
        raise

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        logger.info("Disconnected from MongoDB")

async def get_database():
    """Dependency to get database instance"""
    return db.database
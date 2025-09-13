from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from database.connection import connect_to_mongo, close_mongo_connection
from routers import producers, batches, quality, fairness, pricing, blockchain, analytics, websocket
from routers import certifications, qr

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="TraceChain API",
    description="Decentralized Agricultural Supply Chain Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(producers.router, prefix="/api/v1/producers", tags=["producers"])
app.include_router(batches.router, prefix="/api/v1/batches", tags=["batches"])
app.include_router(quality.router, prefix="/api/v1/quality", tags=["quality"])
app.include_router(fairness.router, prefix="/api/v1/fairness", tags=["fairness"])
app.include_router(pricing.router, prefix="/api/v1/pricing", tags=["pricing"])
app.include_router(blockchain.router, prefix="/api/v1/blockchain", tags=["blockchain"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["analytics"])
app.include_router(websocket.router, prefix="/ws", tags=["websocket"])
app.include_router(certifications.router, prefix="/api/v1/certifications", tags=["certifications"])
app.include_router(qr.router, prefix="/api/v1/qr", tags=["qr-codes"])

@app.get("/")
async def root():
    return {"message": "TraceChain API - Decentralized Agricultural Supply Chain Platform"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "TraceChain API is running"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
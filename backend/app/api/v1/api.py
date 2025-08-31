"""
Main API router for v1 endpoints
"""

from fastapi import APIRouter
from app.api.v1.endpoints import analysis, startups, documents, health

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(health.router, prefix="/health", tags=["health"])
api_router.include_router(startups.router, prefix="/startups", tags=["startups"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(analysis.router, prefix="/analysis", tags=["analysis"])

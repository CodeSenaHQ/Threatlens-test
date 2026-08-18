# app/api/__init__.py

from fastapi import APIRouter

from .auth_route import router as auth_router

api_router = APIRouter()

# Include routers
api_router.include_router(auth_router)
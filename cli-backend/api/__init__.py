# app/api/__init__.py

from fastapi import APIRouter

from .auth_route import router as auth_router
from .chat_route import router as chat_router
from .git_route import router as git_router
from .llm_gateway_route import router as llm_gateway_router

api_router = APIRouter()

# Include routers
api_router.include_router(auth_router)
api_router.include_router(chat_router)
api_router.include_router(git_router)
api_router.include_router(llm_gateway_router)
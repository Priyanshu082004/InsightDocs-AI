"""Aggregates all v1 endpoint routers under /api/v1 (Decision 3:
every AI endpoint is versioned)."""

from fastapi import APIRouter

from app.api.v1 import analysis, chat, embeddings, ocr

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(analysis.router)
api_v1_router.include_router(chat.router)
api_v1_router.include_router(embeddings.router)
api_v1_router.include_router(ocr.router)

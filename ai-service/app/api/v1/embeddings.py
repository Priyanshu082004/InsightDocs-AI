"""Embedding endpoint — POST /api/v1/embeddings (batch-first)."""

from fastapi import APIRouter

from app.schemas.embedding import EmbedRequest, EmbedResponse
from app.services import embedding_service

router = APIRouter(prefix="/embeddings", tags=["embeddings"])


@router.post("", response_model=EmbedResponse)
async def create_embeddings(payload: EmbedRequest) -> EmbedResponse:
    return await embedding_service.embed(payload.texts)

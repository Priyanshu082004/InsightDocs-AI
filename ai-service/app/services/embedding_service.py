"""Embedding service — thin orchestration over the local bge-m3 provider."""

from app.core.config import settings
from app.providers import embedding as embedding_provider
from app.schemas.embedding import EmbedResponse


async def embed(texts: list[str]) -> EmbedResponse:
    vectors = await embedding_provider.embed_texts(texts)
    return EmbedResponse(
        embeddings=vectors,
        model_name=settings.embedding_model,
        dimensions=settings.embedding_dimensions,
    )

"""Local embedding provider — serves BAAI/bge-m3 via sentence-transformers.

Replaces the backend's former openAI.provider.js (which pointed at OpenAI
and required an API key the project never had). The model matches the
.env contract exactly: EMBEDDING_MODEL=BAAI/bge-m3, 1024 dimensions —
the same dimension the Atlas Vector Search index must be built with.

The model is loaded lazily on first use and cached for the process
lifetime (it is ~2GB of weights; loading per-request would be absurd).
Encoding runs in a worker thread so the async event loop is never
blocked by CPU-bound inference.
"""

import asyncio
from functools import lru_cache

from sentence_transformers import SentenceTransformer

from app.core.config import settings
from app.core.exceptions import ProviderError
from app.core.logging import logger


@lru_cache(maxsize=1)
def _get_model() -> SentenceTransformer:
    logger.info("Loading embedding model %s (first call only)...", settings.embedding_model)
    return SentenceTransformer(settings.embedding_model)


async def embed_texts(texts: list[str]) -> list[list[float]]:
    try:
        model = await asyncio.to_thread(_get_model)
        vectors = await asyncio.to_thread(
            model.encode, texts, normalize_embeddings=True
        )
        return [vector.tolist() for vector in vectors]
    except Exception as err:  # noqa: BLE001 — provider boundary
        logger.error("Embedding generation failed: %s", err)
        raise ProviderError("AI embedding failed") from err

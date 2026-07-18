"""Request/response contracts for embedding generation.

Batch-first: the backend's EMBEDDING pipeline stage embeds many chunks,
so accepting a list amortizes model overhead in one round trip. A single
query embedding is just a one-element batch.
"""

from pydantic import BaseModel, Field


class EmbedRequest(BaseModel):
    texts: list[str] = Field(min_length=1, description="Texts to embed, order preserved")


class EmbedResponse(BaseModel):
    embeddings: list[list[float]]
    model_name: str
    dimensions: int

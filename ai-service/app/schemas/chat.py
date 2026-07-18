"""Request contract for RAG chat streaming.

The backend performs retrieval (Atlas Vector Search stays backend-side)
and sends the question plus the retrieved chunks as structured data.
The AI service builds the RAG prompt internally and streams tokens back
as Server-Sent Events; there is no response model here because the
response is an SSE stream, not JSON.
"""

from pydantic import BaseModel, Field


class ContextChunk(BaseModel):
    """One retrieved document chunk, in backend ranking order."""

    text: str
    chunk_id: str | None = Field(
        default=None, description="Backend chunk id, echoed for traceability"
    )


class ChatStreamRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    chunks: list[ContextChunk] = Field(
        default_factory=list,
        description="Retrieved context chunks; order defines [Source N] numbering",
    )

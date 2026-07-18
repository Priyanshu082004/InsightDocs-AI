"""Request/response contracts for document analysis endpoints.

The backend sends STRUCTURED payloads (raw text + metadata), never
prompts — prompt construction happens exclusively in app/prompts/.
Response shapes mirror what the backend persisted before the migration:
keywords -> {"keywords": [...]}, risk -> {"level","flags","details"}.
"""

from typing import Literal

from pydantic import BaseModel, Field


class AnalysisRequest(BaseModel):
    """Shared input for summary/keywords/risk: the extracted document text."""

    text: str = Field(min_length=1, description="Extracted plain text of the document")
    document_id: str | None = Field(
        default=None, description="Backend document id, for log correlation only"
    )


class SummaryResponse(BaseModel):
    summary: str
    model_version: str


class KeywordsResponse(BaseModel):
    keywords: list[str]
    model_version: str


class RiskResponse(BaseModel):
    level: Literal["LOW", "MEDIUM", "HIGH"]
    flags: list[str]
    details: str | None = None
    model_version: str

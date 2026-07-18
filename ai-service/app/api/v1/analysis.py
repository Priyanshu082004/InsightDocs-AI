"""Analysis endpoints — summary, keywords, risk.

Thin controllers (same rule as the backend's Express controllers):
validate via schema, delegate to the service, return the response model.
"""

from fastapi import APIRouter

from app.schemas.analysis import (
    AnalysisRequest,
    KeywordsResponse,
    RiskResponse,
    SummaryResponse,
)
from app.services import analysis_service

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/summary", response_model=SummaryResponse)
async def summarize(payload: AnalysisRequest) -> SummaryResponse:
    return await analysis_service.generate_summary(payload.text)


@router.post("/keywords", response_model=KeywordsResponse)
async def extract_keywords(payload: AnalysisRequest) -> KeywordsResponse:
    return await analysis_service.generate_keywords(payload.text)


@router.post("/risk", response_model=RiskResponse)
async def analyze_risk(payload: AnalysisRequest) -> RiskResponse:
    return await analysis_service.generate_risk(payload.text)

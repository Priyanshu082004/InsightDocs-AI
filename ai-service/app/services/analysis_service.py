"""Analysis service — orchestrates summary/keywords/risk generation."""

from app.core.config import settings
from app.prompts.keywords import build_keywords_prompt
from app.prompts.risk import build_risk_prompt
from app.prompts.summary import build_summary_prompt
from app.providers import openrouter
from app.schemas.analysis import KeywordsResponse, RiskResponse, SummaryResponse

_VALID_RISK_LEVELS = {"LOW", "MEDIUM", "HIGH"}


async def generate_summary(text: str) -> SummaryResponse:
    summary = await openrouter.generate_text(build_summary_prompt(text))
    return SummaryResponse(summary=summary, model_version=settings.openrouter_model)


async def generate_keywords(text: str) -> KeywordsResponse:
    data = await openrouter.generate_json(build_keywords_prompt(text))
    keywords = data.get("keywords", [])
    # Defensive shaping: models occasionally return non-string entries.
    keywords = [str(k) for k in keywords if k]
    return KeywordsResponse(keywords=keywords, model_version=settings.openrouter_model)


async def generate_risk(text: str) -> RiskResponse:
    data = await openrouter.generate_json(build_risk_prompt(text))
    level = str(data.get("level", "LOW")).upper()
    if level not in _VALID_RISK_LEVELS:
        level = "LOW"
    return RiskResponse(
        level=level,
        flags=[str(f) for f in data.get("flags", []) if f],
        details=data.get("details"),
        model_version=settings.openrouter_model,
    )

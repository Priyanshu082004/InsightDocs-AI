"""Risk-analysis prompt — verbatim port of buildRiskAnalysisPrompt from the
backend's former modules/ai/prompts/index.js."""


def build_risk_prompt(text: str) -> str:
    return f'''Analyze the following document for sensitive or high-risk content — personally identifiable information (PII), financial account details, health information, credentials, or confidential business data. Return a JSON object of this exact shape:
{{"level": "LOW" | "MEDIUM" | "HIGH", "flags": ["contains_pii", "contains_financial_data", ...], "details": "one or two sentence explanation"}}

Base the level on the sensitivity and volume of risky content actually found, not on document length.

Document text:
"""
{text}
"""'''

"""Keywords prompt — verbatim port of buildKeywordsPrompt from the backend's
former modules/ai/prompts/index.js."""


def build_keywords_prompt(text: str) -> str:
    return f'''Extract the 5-15 most important keywords, key phrases, or named entities from the following document. Return a JSON object of this exact shape:
{{"keywords": ["term1", "term2", ...]}}

Document text:
"""
{text}
"""'''

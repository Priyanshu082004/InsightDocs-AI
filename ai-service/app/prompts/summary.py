"""Summary prompt — verbatim port of buildSummaryPrompt from the backend's
former modules/ai/prompts/index.js. Kept word-for-word so summaries are
indistinguishable from pre-migration output."""


def build_summary_prompt(text: str) -> str:
    return f'''You are summarizing a document stored in a secure document vault. Produce a concise, professional summary (3-6 sentences) covering the document's main purpose, key points, and any notable figures, dates, or names. Return ONLY the summary text — no preface like "Here is a summary", no headers.

Document text:
"""
{text}
"""'''

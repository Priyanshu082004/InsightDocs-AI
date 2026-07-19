"""Summary prompt """


def build_summary_prompt(text: str) -> str:
    return f'''You are summarizing a document stored in a secure document vault. Produce a concise, professional summary (3-6 sentences) covering the document's main purpose, key points, and any notable figures, dates, or names. Return ONLY the summary text — no preface like "Here is a summary", no headers.

Document text:
"""
{text}
"""'''

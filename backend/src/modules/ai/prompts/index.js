export const buildSummaryPrompt = (text) => `You are summarizing a document stored in a secure document vault. Produce a concise, professional summary (3-6 sentences) covering the document's main purpose, key points, and any notable figures, dates, or names. Return ONLY the summary text — no preface like "Here is a summary", no headers.

Document text:
"""
${text}
"""`;

export const buildKeywordsPrompt = (text) => `Extract the 5-15 most important keywords, key phrases, or named entities from the following document. Return a JSON object of this exact shape:
{"keywords": ["term1", "term2", ...]}

Document text:
"""
${text}
"""`;

export const buildRiskAnalysisPrompt = (text) => `Analyze the following document for sensitive or high-risk content — personally identifiable information (PII), financial account details, health information, credentials, or confidential business data. Return a JSON object of this exact shape:
{"level": "LOW" | "MEDIUM" | "HIGH", "flags": ["contains_pii", "contains_financial_data", ...], "details": "one or two sentence explanation"}

Base the level on the sensitivity and volume of risky content actually found, not on document length.

Document text:
"""
${text}
"""`;
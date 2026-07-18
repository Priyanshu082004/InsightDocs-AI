"""OCR prompt — verbatim port of the hardcoded prompt from the backend's
former Llm.service.js extractTextFromImage."""

OCR_PROMPT = (
    "Extract all readable text from this image. "
    "Return plain text only — no commentary, no formatting."
)

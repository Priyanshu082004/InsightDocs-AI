"""OCR service — extracts text from an image via the vision-capable LLM."""

from app.core.config import settings
from app.prompts.ocr import OCR_PROMPT
from app.providers import openrouter
from app.schemas.ocr import OcrResponse


async def extract_text(image_bytes: bytes, mime_type: str) -> OcrResponse:
    text = await openrouter.generate_vision_text(OCR_PROMPT, image_bytes, mime_type)
    return OcrResponse(text=text, model_version=settings.openrouter_model)

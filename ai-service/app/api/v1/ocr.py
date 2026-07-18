"""OCR endpoint — POST /api/v1/ocr (multipart image upload).

The backend fetches the object from MinIO (storage stays backend-owned)
and forwards the bytes here; this service never touches MinIO directly.
"""

from fastapi import APIRouter, File, UploadFile

from app.schemas.ocr import OcrResponse
from app.services import ocr_service

router = APIRouter(prefix="/ocr", tags=["ocr"])


@router.post("", response_model=OcrResponse)
async def run_ocr(file: UploadFile = File(...)) -> OcrResponse:
    image_bytes = await file.read()
    return await ocr_service.extract_text(
        image_bytes, file.content_type or "image/png"
    )

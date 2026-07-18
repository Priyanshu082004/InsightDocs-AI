"""Response contract for OCR.

The request side is a multipart file upload (see api/v1/ocr.py), so only
the response is modeled here.
"""

from pydantic import BaseModel


class OcrResponse(BaseModel):
    text: str
    model_version: str

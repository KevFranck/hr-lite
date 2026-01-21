import uuid
from pathlib import Path
from fastapi import UploadFile

ALLOWED_IMAGE_TYPE = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_IMAGE_BYTES = 2 * 1024 * 1024  # 2 MB

def save_employee_photo(file: UploadFile) -> str:
    if file.content_type not in ALLOWED_IMAGE_TYPE:
        raise ValueError("Unsupported image type (only JPEG, PNG, WEBP allowed)")

    contents = file.file.read()

    if len(contents) > MAX_IMAGE_BYTES:
        raise ValueError("Image size exceeds 2 MB limit (max 2 MB allowed)")

    ext = ALLOWED_IMAGE_TYPE[file.content_type]
    filename = f"{uuid.uuid4()}{ext}"

    media_dir = Path("media") / "employees"
    media_dir.mkdir(parents=True, exist_ok=True)
    path = media_dir / filename

    with open(path, "wb") as f:
        f.write(contents)

    return f"/media/employees/{filename}"

import uuid
from pathlib import Path
from fastapi import UploadFile

ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
}

MAX_IMAGE_BYTES = 2 * 1024 * 1024  # 2MB
MEDIA_ROOT = Path("media") / "employees"


def save_employee_photo(file: UploadFile) -> tuple[str, Path]:
    """
    Sauvegarde la photo et retourne:
    - l'URL publique (/media/employees/...)
    - le chemin fichier sur disque (Path) pour cleanup si besoin
    """
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise ValueError("Unsupported image type (allowed: jpg, png, webp)")

    content = file.file.read()
    if len(content) > MAX_IMAGE_BYTES:
        raise ValueError("Image too large (max 2MB)")

    ext = ALLOWED_IMAGE_TYPES[file.content_type]
    filename = f"{uuid.uuid4()}{ext}"

    MEDIA_ROOT.mkdir(parents=True, exist_ok=True)
    file_path = MEDIA_ROOT / filename

    with open(file_path, "wb") as f:
        f.write(content)

    url = f"/media/employees/{filename}"
    return url, file_path


def safe_delete_file(path: Path) -> None:
    try:
        if path.exists():
            path.unlink()
    except Exception:
        # on ne casse pas l'API si cleanup échoue
        pass

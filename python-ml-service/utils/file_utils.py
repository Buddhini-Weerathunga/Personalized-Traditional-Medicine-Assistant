from pathlib import Path
from typing import Iterable

def ensure_dirs(paths: Iterable[Path]) -> None:
    for p in paths:
        p.mkdir(parents=True, exist_ok=True)

def list_image_files(root: Path, extensions={".jpg", ".jpeg", ".png"}):
    files = []
    for ext in extensions:
        files.extend(root.rglob(f"*{ext}"))
    return files

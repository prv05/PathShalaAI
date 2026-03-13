import json
from pathlib import Path

BASE = Path("data/chroma/ncert/class_6/science/chapter_8")
TEXT_DIR = BASE / "english"
META_FILE = BASE / "metadata.json"

meta = json.loads(META_FILE.read_text())

error = False

for file in TEXT_DIR.glob("*.txt"):
    if "__" not in file.stem:
        print(f"[ERROR] Invalid filename format: {file.name}")
        error = True
        continue

    topic, subtopic = file.stem.split("__")

    if topic not in meta["topics"]:
        print(f"[ERROR] Topic missing in metadata: {topic}")
        error = True
        continue

    if subtopic not in meta["topics"][topic]:
        print(f"[ERROR] Subtopic missing in metadata: {subtopic}")
        error = True
        continue

if error:
    raise SystemExit("[FAILED] Metadata validation FAILED")

print("[OK] Metadata validation passed")
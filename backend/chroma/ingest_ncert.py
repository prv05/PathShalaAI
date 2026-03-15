import json
import os
from pathlib import Path
import chromadb
from chromadb.utils import embedding_functions
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

# ---------- PATHS ----------
INGEST_CLASS_DIR = os.getenv("INGEST_CLASS_DIR", "class_10")
INGEST_SUBJECT = os.getenv("INGEST_SUBJECT", "science")
INGEST_CHAPTER = os.getenv("INGEST_CHAPTER", "chapter_1")
INGEST_LANGUAGE = os.getenv("INGEST_LANGUAGE", "english")

DATA_ROOT = Path(__file__).resolve().parents[2] / "data" / "chroma" / "ncert"
BASE = DATA_ROOT / INGEST_CLASS_DIR / INGEST_SUBJECT / INGEST_CHAPTER
TEXT_DIR = BASE / INGEST_LANGUAGE
META_FILE = BASE / "metadata.json"
CHROMA_PERSIST = Path(os.getenv("CHROMA_PERSIST_DIR", str(BASE_DIR / "chroma" / "data")))

# ---------- LOAD METADATA ----------
if not META_FILE.exists():
    raise FileNotFoundError(f"Metadata file not found: {META_FILE}")

if not TEXT_DIR.exists():
    raise FileNotFoundError(f"Text directory not found: {TEXT_DIR}")

metadata_master = json.loads(META_FILE.read_text(encoding="utf-8"))

# ---------- EMBEDDING FUNCTION ----------
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# ---------- CHROMA CLIENT ----------
client = chromadb.PersistentClient(
    path=str(CHROMA_PERSIST)
)

COLLECTION_NAME = os.getenv(
    "INGEST_COLLECTION_NAME",
    f"ncert_class{str(metadata_master.get('class', '10')).strip()}_{str(metadata_master.get('subject', 'science')).strip().lower()}"
)

collection = client.get_or_create_collection(
    name=COLLECTION_NAME,
    embedding_function=embedding_function
)

# ---------- INGEST ----------
index = 1

for file in TEXT_DIR.glob("*.txt"):
    text = file.read_text(encoding="utf-8").strip()
    wc = len(text.split())

    # ✅ DEFINE topic & subtopic FIRST
    topic, subtopic = file.stem.split("__")

    # ✅ WORD COUNT RULES (Option 2)
    if topic == "Activity_and_Experiment":
        if wc < 15 or wc > 1000:
            raise ValueError(f"Invalid word count in {file.name}: {wc}")
    else:
        if wc < 80 or wc > 1000:
            raise ValueError(f"Invalid word count in {file.name}: {wc}")

    # ✅ METADATA CHECK
    if topic not in metadata_master["topics"]:
        raise ValueError(f"Topic not in metadata: {topic}")

    if subtopic not in metadata_master["topics"][topic]:
        raise ValueError(f"Subtopic not in metadata: {subtopic}")

    metadata = {
        "class": metadata_master["class"],
        "subject": metadata_master["subject"],
        "chapter": metadata_master["chapter"],
        "chapter_id": metadata_master["chapter_id"],
        "topic": topic,
        "subtopic": subtopic,
        "language": metadata_master["language"],
        "source": "NCERT"
    }

    cls = str(metadata_master.get("class", "")).strip().replace(" ", "")
    subj = str(metadata_master.get("subject", "science")).strip().lower().replace(" ", "_")
    chapter_id = str(metadata_master.get("chapter_id", "ch")).strip().lower().replace(" ", "_")
    lang = str(metadata_master.get("language", "en")).strip().lower().replace(" ", "_")
    doc_id = f"{cls}_{subj}_{chapter_id}_{topic}_{subtopic}_{lang}_{index:03d}"

    collection.add(
        documents=[text],
        metadatas=[metadata],
        ids=[doc_id]
    )

    index += 1

print(f"Ingestion completed. Total chunks ingested: {index - 1}")
print(f"Collection: {COLLECTION_NAME}")
print(f"Source: {BASE}")
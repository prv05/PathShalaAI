import json
from pathlib import Path
import chromadb
from chromadb.utils import embedding_functions

# ---------- PATHS ----------
BASE = Path("data/chroma/ncert/class_10/science/chapter_1")
TEXT_DIR = BASE / "english"
META_FILE = BASE / "metadata.json"
CHROMA_PERSIST = Path(__file__).parent.parent / "chroma" / "data"

# ---------- LOAD METADATA ----------
metadata_master = json.loads(META_FILE.read_text(encoding="utf-8"))

# ---------- EMBEDDING FUNCTION ----------
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# ---------- CHROMA CLIENT ----------
client = chromadb.PersistentClient(
    path=str(CHROMA_PERSIST)
)

COLLECTION_NAME = "ncert_class10_science"

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

    doc_id = f"10_science_ch1_{topic}_{subtopic}_en_{index:03d}"

    collection.add(
        documents=[text],
        metadatas=[metadata],
        ids=[doc_id]
    )

    index += 1

print(f"✅ Ingestion completed. Total chunks ingested: {index - 1}")
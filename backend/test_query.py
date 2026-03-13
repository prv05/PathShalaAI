import chromadb
from pathlib import Path

# Use same persist directory as ingest script
CHROMA_PERSIST = Path(__file__).parent / "chroma" / "data"

client = chromadb.PersistentClient(
    path=str(CHROMA_PERSIST)
)

COLLECTION_NAME = "ncert_class10_science"

collection = client.get_collection(name=COLLECTION_NAME)

query = "What is a chemical reaction?"

results = collection.query(
    query_texts=[query],
    n_results=5,
    where={
        "$and": [
            {"class": "10"},
            {"subject": "Science"},
            {"chapter": "Chemical Reactions and Equations"},
            {"language": "en"}
        ]
    }
)

print("Query:", query)
print("\nRetrieved documents:\n")

if not results["documents"] or not results["documents"][0]:
    print("❌ No documents retrieved")
else:
    for i, doc in enumerate(results["documents"][0], start=1):
        print(f"--- Result {i} ---")
        print(doc[:400])
        print()
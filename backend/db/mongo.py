"""MongoDB connector and simple smoke test.

Run directly to insert and fetch from the three collections.
"""
import json
import os
import time
from typing import Any, Dict

from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise RuntimeError("MONGO_URI is required for MongoDB Atlas connectivity")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "pathshala")


COLLECTIONS = {
    "lesson_sessions": "lesson_sessions",
    "doubts_asked": "doubts_asked",
    "ai_interactions": "ai_interactions",
}


def get_client(uri: str | None = None) -> MongoClient:
    return MongoClient(uri or MONGO_URI, uuidRepresentation="standard")


def get_db(client: MongoClient | None = None, name: str | None = None):
    cli = client or get_client()
    return cli[name or MONGO_DB_NAME]


def init_collections(db) -> Dict[str, Any]:
    for coll_name in COLLECTIONS.values():
        db[coll_name].create_index("created_at")
    return {k: db[v].name for k, v in COLLECTIONS.items()}


def test_insert_and_fetch(db=None) -> Dict[str, Any]:
    database = db or get_db()
    init_collections(database)
    ts = int(time.time())

    lesson_doc = {
        "lesson_id": "lesson-1",
        "user_id": "user-1",
        "status": "started",
        "created_at": ts,
    }
    doubt_doc = {
        "question": "What is photosynthesis?",
        "user_id": "user-1",
        "created_at": ts,
    }
    ai_doc = {
        "interaction_type": "insight",
        "user_id": "user-1",
        "prompt": "Summarize chapter 1",
        "created_at": ts,
    }

    database[COLLECTIONS["lesson_sessions"]].insert_one(lesson_doc)
    database[COLLECTIONS["doubts_asked"]].insert_one(doubt_doc)
    database[COLLECTIONS["ai_interactions"]].insert_one(ai_doc)

    last_lesson = database[COLLECTIONS["lesson_sessions"]].find_one(sort=[("_id", -1)])
    last_doubt = database[COLLECTIONS["doubts_asked"]].find_one(sort=[("_id", -1)])
    last_ai = database[COLLECTIONS["ai_interactions"]].find_one(sort=[("_id", -1)])

    return {
        "lesson_sessions": _stringify_ids(last_lesson),
        "doubts_asked": _stringify_ids(last_doubt),
        "ai_interactions": _stringify_ids(last_ai),
    }


def _stringify_ids(document: Dict[str, Any] | None) -> Dict[str, Any] | None:
    if document is None:
        return None
    doc_copy = dict(document)
    if "_id" in doc_copy:
        doc_copy["_id"] = str(doc_copy["_id"])
    return doc_copy


if __name__ == "__main__":
    result = test_insert_and_fetch()
    print(json.dumps(result, indent=2))

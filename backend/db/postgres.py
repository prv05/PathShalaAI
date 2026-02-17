"""PostgreSQL connector and lightweight schema helpers.

Run this file directly to perform a smoke test (create tables, insert rows, fetch one row).
"""
import json
import os
import uuid
from typing import Any, Dict

from sqlalchemy import Column, DateTime, ForeignKey, MetaData, String, Table, create_engine, func, select
from sqlalchemy.engine import Engine

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is required for cloud PostgreSQL connectivity")

metadata = MetaData()

users = Table(
    "users",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("email", String(255), unique=True, nullable=False),
    Column("name", String(120), nullable=False),
    Column("class_level", String(20), nullable=True),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
)

subjects = Table(
    "subjects",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("name", String(120), nullable=False),
    Column("class_level", String(20), nullable=True),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
)

chapters = Table(
    "chapters",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("subject_id", String(36), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False),
    Column("title", String(200), nullable=False),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
)

topics = Table(
    "topics",
    metadata,
    Column("id", String(36), primary_key=True),
    Column("chapter_id", String(36), ForeignKey("chapters.id", ondelete="CASCADE"), nullable=False),
    Column("title", String(200), nullable=False),
    Column("description", String(500), nullable=True),
    Column("created_at", DateTime(timezone=True), server_default=func.now()),
)


def get_engine(url: str | None = None) -> Engine:
    return create_engine(url or DATABASE_URL, pool_pre_ping=True)


def init_postgres(engine: Engine | None = None) -> Engine:
    eng = engine or get_engine()
    metadata.create_all(eng)
    return eng


def _random_email() -> str:
    return f"student+{uuid.uuid4().hex[:8]}@example.com"


def test_insert_and_fetch(engine: Engine | None = None) -> Dict[str, Any]:
    eng = engine or get_engine()
    init_postgres(eng)

    with eng.begin() as conn:
        user_id = str(uuid.uuid4())
        subject_id = str(uuid.uuid4())
        chapter_id = str(uuid.uuid4())
        topic_id = str(uuid.uuid4())

        conn.execute(
            users.insert().values(
                id=user_id,
                email=_random_email(),
                name="Test User",
                class_level="10",
            )
        )

        conn.execute(
            subjects.insert().values(
                id=subject_id,
                name="Mathematics",
                class_level="10",
            )
        )

        conn.execute(
            chapters.insert().values(
                id=chapter_id,
                subject_id=subject_id,
                title="Algebra",
            )
        )

        conn.execute(
            topics.insert().values(
                id=topic_id,
                chapter_id=chapter_id,
                title="Linear Equations",
                description="Testing topic insert",
            )
        )

        fetched_user = conn.execute(select(users).limit(1)).mappings().first()
        fetched_topic = conn.execute(select(topics).limit(1)).mappings().first()

    return {
        "user": dict(fetched_user) if fetched_user else None,
        "topic": dict(fetched_topic) if fetched_topic else None,
    }


if __name__ == "__main__":
    result = test_insert_and_fetch()
    print(json.dumps(result, indent=2, default=str))

"""
Central configuration module for the Flask application.
Loads environment variables and provides configuration constants.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

# Flask Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret123")
PORT = int(os.getenv("PORT", 8000))
FLASK_DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "")
MONGO_URI = os.getenv("MONGO_URI", "")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "pathshala")

# ChromaDB Configuration
CHROMA_PERSIST_DIR = os.getenv("CHROMA_PERSIST_DIR", str(BASE_DIR / "chroma" / "data"))
CHROMA_COLLECTION_NAME = os.getenv("CHROMA_COLLECTION_NAME", "ncert_class10_science")
CHROMA_COLLECTION_CLASS_6 = os.getenv("CHROMA_COLLECTION_CLASS_6", "ncert_class6_science")
CHROMA_COLLECTION_CLASS_10 = os.getenv("CHROMA_COLLECTION_CLASS_10", "ncert_class10_science")
DEFAULT_CLASS_LEVEL = os.getenv("DEFAULT_CLASS_LEVEL", "10")
CHROMA_USE_CLASS_FILTER = os.getenv("CHROMA_USE_CLASS_FILTER", "true").lower() == "true"

CLASS_COLLECTIONS = {
    "6": CHROMA_COLLECTION_CLASS_6,
    "10": CHROMA_COLLECTION_CLASS_10,
}

# HuggingFace LLM Configuration
HF_API_URL = os.getenv("HF_API_URL", "https://router.huggingface.co/v1/chat/completions")
HF_MODEL = os.getenv("HF_MODEL", "meta-llama/Meta-Llama-3-8B-Instruct")
HF_API_KEY = os.getenv("HF_API_KEY", "")

# LLM Prompt Configuration
SYSTEM_PROMPT = """You are a CBSE Science teacher.
Answer ONLY using the provided NCERT context.

Rules:
- Do NOT use outside knowledge
- Do NOT hallucinate
- If the answer is not in the context say: "This topic is not covered in the current chapter."
"""

# Logging Configuration
INTERACTION_LOG_COLLECTION = "interaction_logs"
TEACHING_LOG_COLLECTION = "teaching_logs"

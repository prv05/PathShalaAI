import os
from dataclasses import dataclass, field
from typing import List

from dotenv import load_dotenv

load_dotenv()


def _get_env_required(key: str) -> str:
    value = os.getenv(key)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {key}")
    return value


@dataclass
class BaseConfig:
    SECRET_KEY: str = _get_env_required("SECRET_KEY")
    DEBUG: bool = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    DATABASE_URL: str = _get_env_required("DATABASE_URL")
    MONGO_URI: str = _get_env_required("MONGO_URI")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "pathshala")
    CORS_ORIGINS: List[str] = field(
        default_factory=lambda: os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    )


def get_config() -> BaseConfig:
    return BaseConfig()

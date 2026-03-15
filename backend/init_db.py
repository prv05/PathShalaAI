"""
Initialization script for setting up the backend.
Run this script once before starting the server to initialize databases.
"""
import sys
import os
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from db.postgres import init_db
from db.mongo import init_mongo
from config import DATABASE_URL, MONGO_URI


def main():
    """Initialize all databases and services"""
    print("=" * 60)
    print("PathShala AI Backend Initialization")
    print("=" * 60)
    
    # Check environment variables
    print("\n1. Checking Environment Configuration...")
    if not DATABASE_URL:
        print("✗ DATABASE_URL not set in .env")
        return False
    else:
        print("✓ PostgreSQL configured")
    
    if not MONGO_URI:
        print("✗ MONGO_URI not set in .env")
        return False
    else:
        print("✓ MongoDB configured")
    
    # Initialize PostgreSQL
    print("\n2. Initializing PostgreSQL...")
    try:
        init_db()
        print("✓ PostgreSQL initialized successfully")
    except Exception as e:
        print(f"✗ PostgreSQL initialization failed: {e}")
        return False
    
    # Initialize MongoDB
    print("\n3. Initializing MongoDB...")
    try:
        init_mongo()
        print("✓ MongoDB initialized successfully")
    except Exception as e:
        print(f"✗ MongoDB initialization failed: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("✓ Initialization Complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Run ChromaDB ingestion: python backend/chroma/ingest_ncert.py")
    print("2. Start the server: python app.py")
    print("3. Access API at http://localhost:8000")
    
    return True


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

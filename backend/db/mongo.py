"""
MongoDB connection and helper functions.
Manages connections to MongoDB Atlas for dynamic AI data and logs.
"""
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError
from config import MONGO_URI, MONGO_DB_NAME
from datetime import datetime


def get_mongo_client():
    """
    Get a MongoDB client instance.
    """
    if not MONGO_URI:
        raise ValueError("MONGO_URI environment variable is not set")
    
    return MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)


def get_db():
    """
    Get the MongoDB database instance.
    """
    client = get_mongo_client()
    return client[MONGO_DB_NAME]


def log_interaction(question, retrieved_chunks, answer, model, latency, user_id=None, class_level=None):
    """
    Log an AI interaction to MongoDB.
    
    Args:
        question: The question asked
        retrieved_chunks: List of retrieved context chunks
        answer: The LLM-generated answer
        model: The model used
        latency: Response time in seconds
        user_id: Optional user ID
        class_level: Optional class level
    """
    try:
        db = get_db()
        collection = db["interaction_logs"]
        
        log_entry = {
            "question": question,
            "retrieved_chunks": retrieved_chunks,
            "answer": answer,
            "model": model,
            "latency": latency,
            "user_id": user_id,
            "class_level": class_level,
            "timestamp": datetime.utcnow()
        }
        
        result = collection.insert_one(log_entry)
        return str(result.inserted_id)
    except ServerSelectionTimeoutError:
        print("✗ MongoDB connection failed - interaction not logged")
        return None


def log_teaching_interaction(user_id, class_level, subject, chapter, action, metadata=None):
    """
    Log teaching/learning interactions for analytics.
    
    Args:
        user_id: User ID
        class_level: Class level
        subject: Subject name
        chapter: Chapter name
        action: Action type (e.g., "chapter_started", "quiz_completed", "doubt_raised")
        metadata: Additional metadata dictionary
    """
    try:
        db = get_db()
        collection = db["teaching_logs"]
        
        log_entry = {
            "user_id": user_id,
            "class_level": class_level,
            "subject": subject,
            "chapter": chapter,
            "action": action,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow()
        }
        
        result = collection.insert_one(log_entry)
        return str(result.inserted_id)
    except Exception as e:
        print(f"✗ Error logging teaching interaction: {e}")
        return None


def get_interaction_logs(user_id=None, limit=50):
    """
    Retrieve interaction logs with optional filtering.
    """
    try:
        db = get_db()
        collection = db["interaction_logs"]
        
        query = {}
        if user_id:
            query["user_id"] = user_id
        
        logs = list(collection.find(query).sort("timestamp", -1).limit(limit))
        
        # Convert ObjectId to string for JSON serialization
        for log in logs:
            log["_id"] = str(log["_id"])
        
        return logs
    except Exception as e:
        print(f"✗ Error retrieving logs: {e}")
        return []


def init_mongo():
    """
    Initialize MongoDB collections and indexes.
    """
    try:
        db = get_db()
        
        # Create interaction_logs collection with index
        if "interaction_logs" not in db.list_collection_names():
            db.create_collection("interaction_logs")
        db["interaction_logs"].create_index("timestamp")
        db["interaction_logs"].create_index("user_id")
        
        # Create teaching_logs collection with index
        if "teaching_logs" not in db.list_collection_names():
            db.create_collection("teaching_logs")
        db["teaching_logs"].create_index("timestamp")
        db["teaching_logs"].create_index("user_id")
        db["teaching_logs"].create_index([("class_level", 1), ("subject", 1)])
        
        print("✓ MongoDB collections initialized successfully")
    except Exception as e:
        print(f"✗ Error initializing MongoDB: {e}")

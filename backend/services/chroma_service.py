"""
ChromaDB service layer for managing vector database operations.
Handles collection loading, document retrieval, and metadata filtering.
"""
import chromadb
import re
from pathlib import Path
from config import (
    CHROMA_PERSIST_DIR, 
    CHROMA_COLLECTION_NAME,
    CLASS_COLLECTIONS,
    DEFAULT_CLASS_LEVEL,
    CHROMA_USE_CLASS_FILTER
)


class ChromaService:
    """Service for ChromaDB vector storage operations"""
    
    _client = None
    _collections_cache = {}
    
    @classmethod
    def get_client(cls):
        """Get or create ChromaDB client"""
        if cls._client is None:
            cls._client = chromadb.PersistentClient(path=str(CHROMA_PERSIST_DIR))
        return cls._client
    
    @staticmethod
    def normalize_class_level(value):
        """
        Normalize class level input.
        
        Args:
            value: Class level (string or int)
        
        Returns:
            Normalized class level string
        """
        text = str(value or "").strip()
        if not text:
            return DEFAULT_CLASS_LEVEL
        
        match = re.search(r"\d+", text)
        return match.group(0) if match else text
    
    @staticmethod
    def get_collection_name(class_level):
        """Get collection name for a class level"""
        normalized_class = ChromaService.normalize_class_level(class_level)
        return CLASS_COLLECTIONS.get(normalized_class, CHROMA_COLLECTION_NAME)
    
    @classmethod
    def load_collection(cls, class_level):
        """
        Load or retrieve a ChromaDB collection from cache.
        
        Args:
            class_level: Class level
        
        Returns:
            Collection object or None if not found
        """
        normalized_class = cls.normalize_class_level(class_level)
        
        # Check cache first
        if normalized_class in cls._collections_cache:
            return cls._collections_cache[normalized_class]
        
        collection_name = cls.get_collection_name(normalized_class)
        
        try:
            client = cls.get_client()
            collection = client.get_collection(collection_name)
            cls._collections_cache[normalized_class] = collection
            return collection
        except Exception as e:
            print(f"Error loading collection {collection_name}: {e}")
            return None
    
    @staticmethod
    def search(question, class_level=None, n_results=5):
        """
        Search ChromaDB for relevant documents.
        
        Args:
            question: Query text
            class_level: Optional class level filter
            n_results: Number of results to return
        
        Returns:
            List of document chunks or None if collection not found
        """
        if class_level is None:
            class_level = DEFAULT_CLASS_LEVEL
        
        collection = ChromaService.load_collection(class_level)
        
        if collection is None:
            return None
        
        query_payload = {
            "query_texts": [question],
            "n_results": n_results,
        }
        
        # Add class filter if enabled
        if CHROMA_USE_CLASS_FILTER:
            normalized_class = ChromaService.normalize_class_level(class_level)
            query_payload["where"] = {"class": normalized_class}
        
        try:
            results = collection.query(**query_payload)
            docs = results.get("documents", [[]])[0]
            return docs if docs else []
        except Exception as e:
            print(f"Error querying ChromaDB: {e}")
            return []
    
    @staticmethod
    def get_collection_info(class_level):
        """Get information about a collection"""
        collection = ChromaService.load_collection(class_level)
        
        if collection is None:
            return None
        
        try:
            count = collection.count()
            return {
                "name": collection.name,
                "count": count,
                "class_level": class_level
            }
        except Exception as e:
            print(f"Error getting collection info: {e}")
            return None
    
    @classmethod
    def clear_cache(cls):
        """Clear the collections cache"""
        cls._collections_cache.clear()

"""
RAG (Retrieval-Augmented Generation) API endpoints for AI question answering.
Provides endpoints for students to ask doubts and get AI-powered answers.
"""
from flask import Blueprint, request, jsonify
from api.auth_api import token_required
from services.rag_service import RAGService
from services.chroma_service import ChromaService
from db.mongo import log_teaching_interaction

rag_bp = Blueprint("rag", __name__)


@rag_bp.route("/ask", methods=["POST"])
def ask():
    """
    Ask an AI question endpoint (no auth required for testing).
    
    Expected JSON:
    {
        "question": "string (required)",
        "class": "string or integer (optional, defaults to 10)",
        "class_level": "string or integer (optional, same as class)"
    }
    
    Returns:
    {
        "success": boolean,
        "question": "string",
        "answer": "string",
        "retrieved_chunks": ["string"],
        "class_level": "string",
        "latency": float
    }
    """
    try:
        data = request.get_json(silent=True) or {}
        question = data.get("question", "").strip()
        class_level = data.get("class_level") or data.get("class")
        
        if not question:
            return jsonify({"error": "question is required"}), 400
        
        result = RAGService.answer_question(question, class_level, n_retrieval=5)
        
        return jsonify(result), 200 if result.get("success") else 500
    
    except Exception as e:
        print(f"Error in /ask endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500


@rag_bp.route("/ask-auth", methods=["POST"])
@token_required
def ask_auth():
    """
    Ask an AI question endpoint (requires authentication).
    Logs the interaction with user_id.
    
    Expected JSON: (same as /ask)
    {
        "question": "string (required)",
        "class": "string or integer (optional)"
    }
    """
    try:
        data = request.get_json(silent=True) or {}
        question = data.get("question", "").strip()
        class_level = data.get("class_level") or data.get("class")
        
        if not question:
            return jsonify({"error": "question is required"}), 400
        
        result = RAGService.answer_question(
            question, 
            class_level, 
            user_id=request.user_id,
            n_retrieval=5
        )
        
        # Log teaching interaction
        if result.get("success"):
            log_teaching_interaction(
                user_id=request.user_id,
                class_level=class_level or "10",
                subject="science",
                chapter="general",
                action="doubt_raised",
                metadata={"question": question}
            )
        
        return jsonify(result), 200 if result.get("success") else 500
    
    except Exception as e:
        print(f"Error in /ask-auth endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500


@rag_bp.route("/retrieval-stats", methods=["POST"])
def get_retrieval_stats():
    """
    Debug endpoint to check what documents are retrieved for a question.
    
    Expected JSON:
    {
        "question": "string",
        "class": "string or integer (optional)"
    }
    
    Returns retrieval results without LLM generation.
    """
    try:
        data = request.get_json(silent=True) or {}
        question = data.get("question", "").strip()
        class_level = data.get("class_level") or data.get("class")
        
        if not question:
            return jsonify({"error": "question is required"}), 400
        
        stats = RAGService.get_retrieval_stats(question, class_level, n_retrieval=5)
        
        return jsonify(stats), 200
    
    except Exception as e:
        print(f"Error in /retrieval-stats endpoint: {e}")
        return jsonify({"error": "Internal server error"}), 500


@rag_bp.route("/collection-info", methods=["GET"])
def get_collection_info():
    """
    Get information about available collections.
    
    Query parameters:
    - class: class level (optional, defaults to 10)
    
    Returns collection metadata.
    """
    try:
        class_level = request.args.get("class", "10")
        info = ChromaService.get_collection_info(class_level)
        
        if info is None:
            return jsonify({
                "error": "Collection not found",
                "message": f"ChromaDB collection for class {class_level} not found. "
                          "Run backend/chroma/ingest_ncert.py to create it."
            }), 404
        
        return jsonify(info), 200
    
    except Exception as e:
        print(f"Error getting collection info: {e}")
        return jsonify({"error": "Internal server error"}), 500

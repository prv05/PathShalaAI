"""
RAG (Retrieval-Augmented Generation) service for the full question answering pipeline.
Orchestrates document retrieval from ChromaDB and answer generation via LLM.
"""
import time
from services.chroma_service import ChromaService
from services.llm_service import LLMService
from db.mongo import log_interaction
from config import HF_MODEL


class RAGService:
    """Service orchestrating RAG pipeline (retrieval + generation)"""
    
    @staticmethod
    def answer_question(question, class_level=None, user_id=None, n_retrieval=5):
        """
        Full RAG pipeline: retrieve context and generate answer.
        
        Args:
            question: Student's question
            class_level: Class level
            user_id: ID of the student (for logging)
            n_retrieval: Number of documents to retrieve
        
        Returns:
            Dictionary with question, answer, retrieved chunks, and metadata
        """
        start_time = time.time()
        
        # Step 1: Retrieve relevant documents
        retrieved_chunks = ChromaService.search(question, class_level, n_retrieval)
        
        if retrieved_chunks is None:
            normalized_class = ChromaService.normalize_class_level(class_level)
            collection_name = ChromaService.get_collection_name(normalized_class)
            error_msg = (
                f"Knowledge base not found. Run backend/chroma/ingest_ncert.py to create "
                f"collection {collection_name} for class {normalized_class}."
            )
            return {
                "success": False,
                "question": question,
                "answer": error_msg,
                "retrieved_chunks": [],
                "class_level": class_level
            }
        
        if not retrieved_chunks:
            answer = "This topic is not covered in the current chapter."
            latency = time.time() - start_time
            
            # Log the interaction
            log_interaction(
                question=question,
                retrieved_chunks=[],
                answer=answer,
                model=HF_MODEL,
                latency=latency,
                user_id=user_id,
                class_level=class_level
            )
            
            return {
                "success": True,
                "question": question,
                "answer": answer,
                "retrieved_chunks": [],
                "class_level": class_level,
                "latency": latency
            }
        
        # Step 2: Assemble context from retrieved chunks
        context = RAGService._assemble_context(retrieved_chunks)
        
        # Step 3: Generate answer using LLM
        answer = LLMService.generate_answer(question, context)
        
        latency = time.time() - start_time
        
        # Step 4: Log interaction
        log_interaction(
            question=question,
            retrieved_chunks=retrieved_chunks,
            answer=answer,
            model=HF_MODEL,
            latency=latency,
            user_id=user_id,
            class_level=class_level
        )
        
        return {
            "success": True,
            "question": question,
            "answer": answer,
            "retrieved_chunks": retrieved_chunks,
            "class_level": class_level,
            "latency": round(latency, 2)
        }
    
    @staticmethod
    def _assemble_context(chunks):
        """
        Assemble context from retrieved chunks.
        
        Args:
            chunks: List of document chunks
        
        Returns:
            Single string with all chunks joined
        """
        if not chunks:
            return ""
        
        return "\n\n".join(str(chunk) for chunk in chunks)
    
    @staticmethod
    def get_retrieval_stats(question, class_level=None, n_retrieval=5):
        """
        Get retrieval statistics for a question without generating answer.
        Useful for debugging and testing.
        
        Args:
            question: Question to search
            class_level: Class level
            n_retrieval: Number of results to retrieve
        
        Returns:
            Dictionary with retrieval results
        """
        retrieved_chunks = ChromaService.search(question, class_level, n_retrieval)
        
        return {
            "question": question,
            "class_level": class_level,
            "n_results_requested": n_retrieval,
            "n_results_found": len(retrieved_chunks) if retrieved_chunks else 0,
            "chunks": retrieved_chunks if retrieved_chunks else [],
            "context": RAGService._assemble_context(retrieved_chunks) if retrieved_chunks else ""
        }

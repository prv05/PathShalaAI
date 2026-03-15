"""
Lesson API endpoints for retrieving lesson content and managing progress.
Provides endpoints for chapters, topics, and progress tracking.
"""
from flask import Blueprint, request, jsonify
from api.auth_api import token_required
from models.progress_model import LessonProgress, QuizAttempt
from db.mongo import log_teaching_interaction

lesson_bp = Blueprint("lessons", __name__)


@lesson_bp.route("/get-lesson", methods=["GET"])
def get_lesson():
    """
    Get lesson content for a specific chapter.
    
    Query parameters:
    - class: class level
    - subject: subject name
    - chapter: chapter name
    
    Returns lesson metadata and content structure.
    Note: Actual content would come from your data/ directory.
    """
    try:
        class_level = request.args.get("class", "").strip()
        subject = request.args.get("subject", "").strip()
        chapter = request.args.get("chapter", "").strip()
        
        if not all([class_level, subject, chapter]):
            return jsonify({"error": "Missing required parameters: class, subject, chapter"}), 400
        
        # This is a placeholder - you would load actual lesson content from files/database
        lesson_data = {
            "class": class_level,
            "subject": subject,
            "chapter": chapter,
            "title": f"{subject.title()} - {chapter.title()}",
            "content": "Lesson content would be loaded from your data directory",
            "sections": [],
            "topics": []
        }
        
        return jsonify(lesson_data), 200
    
    except Exception as e:
        print(f"Error retrieving lesson: {e}")
        return jsonify({"error": "Internal server error"}), 500


@lesson_bp.route("/progress", methods=["POST"])
@token_required
def record_progress():
    """
    Record lesson progress for a student.
    
    Expected JSON:
    {
        "class": "string",
        "subject": "string",
        "chapter": "string",
        "topic": "string (optional)",
        "completed": boolean
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Request body is empty"}), 400
        
        class_level = data.get("class", "").strip()
        subject = data.get("subject", "").strip()
        chapter = data.get("chapter", "").strip()
        topic = data.get("topic", "").strip() if data.get("topic") else None
        completed = data.get("completed", False)
        
        if not all([class_level, subject, chapter]):
            return jsonify({"error": "Missing required fields: class, subject, chapter"}), 400
        
        progress_id = LessonProgress.record_progress(
            user_id=request.user_id,
            class_level=class_level,
            subject=subject,
            chapter=chapter,
            topic=topic,
            completed=completed
        )
        
        if not progress_id:
            return jsonify({"error": "Failed to record progress"}), 500
        
        return jsonify({
            "message": "Progress recorded successfully",
            "progress_id": progress_id,
            "completed": completed
        }), 201
    
    except Exception as e:
        print(f"Error recording progress: {e}")
        return jsonify({"error": "Internal server error"}), 500


@lesson_bp.route("/progress", methods=["GET"])
@token_required
def get_progress():
    """
    Get lesson progress for the authenticated student.
    
    Optional query parameters:
    - class: filter by class
    - subject: filter by subject
    """
    try:
        class_level = request.args.get("class", "").strip() or None
        subject = request.args.get("subject", "").strip() or None
        
        progress = LessonProgress.get_progress(
            user_id=request.user_id,
            class_level=class_level,
            subject=subject
        )
        
        stats = LessonProgress.get_completion_stats(request.user_id)
        
        return jsonify({
            "progress": progress,
            "statistics": stats
        }), 200
    
    except Exception as e:
        print(f"Error retrieving progress: {e}")
        return jsonify({"error": "Internal server error"}), 500


@lesson_bp.route("/complete-lesson", methods=["POST"])
@token_required
def complete_lesson():
    """
    Mark a lesson as completed.
    
    Expected JSON:
    {
        "class": "string",
        "subject": "string",
        "chapter": "string"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Request body is empty"}), 400
        
        class_level = data.get("class", "").strip()
        subject = data.get("subject", "").strip()
        chapter = data.get("chapter", "").strip()
        
        if not all([class_level, subject, chapter]):
            return jsonify({"error": "Missing required fields"}), 400
        
        progress_id = LessonProgress.complete_lesson(
            user_id=request.user_id,
            class_level=class_level,
            subject=subject,
            chapter=chapter
        )
        
        if not progress_id:
            return jsonify({"error": "Failed to mark lesson as complete"}), 500
        
        return jsonify({
            "message": "Lesson marked as completed",
            "progress_id": progress_id
        }), 200
    
    except Exception as e:
        print(f"Error completing lesson: {e}")
        return jsonify({"error": "Internal server error"}), 500


@lesson_bp.route("/quiz/attempt", methods=["POST"])
@token_required
def record_quiz():
    """
    Record a quiz attempt.
    
    Expected JSON:
    {
        "class": "string",
        "subject": "string",
        "chapter": "string",
        "score": integer,
        "total_questions": integer
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Request body is empty"}), 400
        
        class_level = data.get("class", "").strip()
        subject = data.get("subject", "").strip()
        chapter = data.get("chapter", "").strip()
        score = data.get("score")
        total_questions = data.get("total_questions")
        
        if not all([class_level, subject, chapter, score is not None, total_questions]):
            return jsonify({"error": "Missing required fields"}), 400
        
        attempt_id = QuizAttempt.record_attempt(
            user_id=request.user_id,
            class_level=class_level,
            subject=subject,
            chapter=chapter,
            score=score,
            total_questions=total_questions
        )
        
        if not attempt_id:
            return jsonify({"error": "Failed to record quiz attempt"}), 500
        
        percentage = round(score / total_questions * 100, 2) if total_questions > 0 else 0
        
        return jsonify({
            "message": "Quiz attempt recorded",
            "attempt_id": attempt_id,
            "score": score,
            "total": total_questions,
            "percentage": percentage
        }), 201
    
    except Exception as e:
        print(f"Error recording quiz: {e}")
        return jsonify({"error": "Internal server error"}), 500


@lesson_bp.route("/quiz/history", methods=["GET"])
@token_required
def get_quiz_history():
    """
    Get quiz attempt history for the student.
    
    Optional query parameters:
    - class: filter by class
    - subject: filter by subject
    - chapter: filter by chapter
    """
    try:
        class_level = request.args.get("class", "").strip() or None
        subject = request.args.get("subject", "").strip() or None
        chapter = request.args.get("chapter", "").strip() or None
        
        attempts = QuizAttempt.get_attempts(
            user_id=request.user_id,
            class_level=class_level,
            subject=subject,
            chapter=chapter
        )
        
        stats = QuizAttempt.get_average_score(request.user_id, class_level)
        
        return jsonify({
            "attempts": attempts,
            "statistics": stats
        }), 200
    
    except Exception as e:
        print(f"Error retrieving quiz history: {e}")
        return jsonify({"error": "Internal server error"}), 500

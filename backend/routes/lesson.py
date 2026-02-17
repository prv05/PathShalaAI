from flask import Blueprint, jsonify, request

lesson_bp = Blueprint("lesson", __name__)


@lesson_bp.post("/start")
def start_lesson():
    payload = request.get_json(force=True, silent=True) or {}
    return (
        jsonify(
            {
                "message": "Lesson session started (stub)",
                "lesson_id": payload.get("lesson_id", "lesson-1"),
                "session_id": "session-123",
            }
        ),
        200,
    )


@lesson_bp.post("/end")
def end_lesson():
    payload = request.get_json(force=True, silent=True) or {}
    return (
        jsonify(
            {
                "message": "Lesson session ended (stub)",
                "lesson_id": payload.get("lesson_id", "lesson-1"),
                "session_id": payload.get("session_id", "session-123"),
                "duration_seconds": payload.get("duration_seconds", 0),
            }
        ),
        200,
    )

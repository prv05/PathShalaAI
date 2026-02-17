from flask import Blueprint, jsonify, request

doubt_bp = Blueprint("doubt", __name__)


@doubt_bp.post("/ask")
def ask_doubt():
    payload = request.get_json(force=True, silent=True) or {}
    return (
        jsonify(
            {
                "message": "Doubt received (stub)",
                "question": payload.get("question", ""),
                "tracking_id": "doubt-123",
            }
        ),
        200,
    )

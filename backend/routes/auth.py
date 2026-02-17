from flask import Blueprint, jsonify, request

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/login")
def login():
    payload = request.get_json(force=True, silent=True) or {}
    email = payload.get("email", "student@example.com")
    return (
        jsonify(
            {
                "message": "Login successful (stub)",
                "email": email,
                "access_token": "dummy-access-token",
                "refresh_token": "dummy-refresh-token",
            }
        ),
        200,
    )


@auth_bp.post("/signup")
def signup():
    payload = request.get_json(force=True, silent=True) or {}
    email = payload.get("email", "student@example.com")
    return (
        jsonify(
            {
                "message": "Signup successful (stub)",
                "email": email,
                "user_id": "placeholder-user-id",
            }
        ),
        201,
    )

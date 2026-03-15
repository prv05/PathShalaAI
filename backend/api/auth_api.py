"""
Authentication API endpoints for signup, login, and token management.
Handles user registration and authentication.
"""
from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
import jwt
from functools import wraps
from config import SECRET_KEY
from models.user_model import User, StudentProfile
from db.mongo import log_teaching_interaction

auth_bp = Blueprint("auth", __name__)


def _validate_email(email):
    """Basic email validation"""
    return "@" in email and "." in email.split("@")[1]


def _validate_password(password):
    """
    Password validation rules.
    Returns: (is_valid, error_message)
    """
    if len(password) < 6:
        return False, "Password must be at least 6 characters"
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one number"
    return True, ""


def _create_token(user_id, user_email, role, expires_in_hours=24):
    """
    Create a JWT token for a user.
    """
    payload = {
        "user_id": user_id,
        "email": user_email,
        "role": role,
        "exp": datetime.utcnow() + timedelta(hours=expires_in_hours),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def token_required(f):
    """Decorator to protect endpoints with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Check for token in Authorization header
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({"error": "Invalid token format"}), 401
        
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user_id = payload["user_id"]
            request.user_role = payload["role"]
            request.user_email = payload["email"]
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        
        return f(*args, **kwargs)
    
    return decorated


@auth_bp.route("/signup", methods=["POST"])
def signup():
    """
    User signup endpoint.
    
    Expected JSON:
    {
        "role": "student" | "parent",
        "full_name": "string",
        "email": "string",
        "password": "string",
        "confirm_password": "string",
        // Student-specific:
        "gender": "Male|Female|Other",
        "class": integer (6-12),
        "board": "CBSE|ICSE|State",
        "last_exam_marks": integer,
        "parent_email": "string"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Request body is empty"}), 400
        
        # Validate required fields
        required_fields = ["role", "full_name", "email", "password", "confirm_password"]
        for field in required_fields:
            if not data.get(field, "").strip():
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        role = data.get("role", "").strip().lower()
        full_name = data.get("full_name", "").strip()
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        confirm_password = data.get("confirm_password", "")
        
        # Validate role
        if role not in ["student", "parent"]:
            return jsonify({"error": "Role must be 'student' or 'parent'"}), 400
        
        # Validate email
        if not _validate_email(email):
            return jsonify({"error": "Invalid email format"}), 400
        
        # Check if email already exists
        if User.email_exists(email):
            return jsonify({"error": "Email already registered"}), 409
        
        # Validate password
        is_valid, error_msg = _validate_password(password)
        if not is_valid:
            return jsonify({"error": error_msg}), 400
        
        # Check password confirmation
        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400
        
        # Create user
        user_id = User.create(full_name, email, password, role)
        
        if not user_id:
            return jsonify({"error": "Failed to create user"}), 500
        
        # If student, create student profile
        if role == "student":
            gender = data.get("gender", "").strip()
            class_level = data.get("class")
            board = data.get("board", "").strip()
            last_exam_marks = data.get("last_exam_marks")
            parent_email = data.get("parent_email", "").strip()
            
            success = StudentProfile.create(
                user_id=user_id,
                gender=gender,
                class_level=class_level,
                board=board,
                last_exam_marks=last_exam_marks,
                parent_email=parent_email
            )
            
            if not success:
                return jsonify({"error": "Failed to create student profile"}), 500
            
            # Log signup in MongoDB
            log_teaching_interaction(
                user_id=user_id,
                class_level=class_level,
                subject="general",
                chapter="signup",
                action="student_signup",
                metadata={"board": board, "gender": gender}
            )
        
        # Create token
        token = _create_token(user_id, email, role)
        
        # Get student profile if applicable
        student_profile = None
        if role == "student":
            student_profile = StudentProfile.get_by_user_id(user_id)
        
        return jsonify({
            "message": "User created successfully",
            "user_id": user_id,
            "email": email,
            "full_name": full_name,
            "role": role,
            "token": token,
            "student_profile": student_profile
        }), 201
    
    except Exception as e:
        print(f"Signup error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    User login endpoint.
    
    Expected JSON:
    {
        "email": "string",
        "password": "string"
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "Request body is empty"}), 400
        
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
        
        # Verify credentials
        user = User.verify_password(email, password)
        
        if not user:
            return jsonify({"error": "Invalid email or password"}), 401
        
        # Create token
        token = _create_token(user["id"], user["email"], user["role"])
        
        # Get student profile if applicable
        student_profile = None
        if user["role"] == "student":
            student_profile = StudentProfile.get_by_user_id(user["id"])
        
        return jsonify({
            "message": "Login successful",
            "user_id": user["id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "token": token,
            "student_profile": student_profile
        }), 200
    
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route("/profile", methods=["GET"])
@token_required
def get_profile():
    """Get current user's profile"""
    try:
        user = User.get_by_id(request.user_id)
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        profile = {"user": user}
        
        if user["role"] == "student":
            student_profile = StudentProfile.get_by_user_id(request.user_id)
            profile["student_profile"] = student_profile
        
        return jsonify(profile), 200
    
    except Exception as e:
        print(f"Profile retrieval error: {e}")
        return jsonify({"error": "Internal server error"}), 500


@auth_bp.route("/validate-token", methods=["POST"])
@token_required
def validate_token():
    """Validate if a token is still valid"""
    return jsonify({
        "valid": True,
        "user_id": request.user_id,
        "role": request.user_role,
        "email": request.user_email
    }), 200

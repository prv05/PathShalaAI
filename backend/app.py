"""
Main Flask application entry point.
Initializes all modules, blueprints, and middleware.
"""
from flask import Flask, jsonify
from flask_cors import CORS
from config import SECRET_KEY, FLASK_DEBUG, PORT, CORS_ORIGINS
from db.postgres import init_db
from db.mongo import init_mongo
from api.auth_api import auth_bp
from api.rag_api import rag_bp
from api.lesson_api import lesson_bp

# Create Flask application
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = SECRET_KEY

# CORS Setup
cors_origins = [origin.strip() for origin in CORS_ORIGINS]
CORS(app, resources={r"/api/*": {"origins": cors_origins}})

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(rag_bp, url_prefix="/api/rag")
app.register_blueprint(lesson_bp, url_prefix="/api/lessons")


# Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "PathShala AI Backend"
    }), 200


# Root endpoint
@app.route("/", methods=["GET"])
def root():
    """Root endpoint with API information"""
    return jsonify({
        "message": "PathShala AI Backend",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "auth": "/api/auth",
            "rag": "/api/rag",
            "lessons": "/api/lessons"
        }
    }), 200


# Error handlers
@app.errorhandler(404)
def not_found(error):
    """404 error handler"""
    return jsonify({
        "error": "Resource not found",
        "status_code": 404
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """500 error handler"""
    return jsonify({
        "error": "Internal server error",
        "status_code": 500
    }), 500


def initialize_databases():
    """Initialize databases on startup"""
    try:
        print("Initializing PostgreSQL...")
        init_db()
        print("✓ PostgreSQL ready")
    except Exception as e:
        print(f"✗ PostgreSQL initialization warning: {e}")
    
    try:
        print("Initializing MongoDB...")
        init_mongo()
        print("✓ MongoDB ready")
    except Exception as e:
        print(f"✗ MongoDB initialization warning: {e}")


if __name__ == "__main__":
    print(f"Starting PathShala AI Backend on port {PORT}...")
    print(f"Debug mode: {FLASK_DEBUG}")
    print(f"CORS origins: {cors_origins}")
    
    # Initialize databases
    initialize_databases()
    
    # Run the app
    app.run(
        host="0.0.0.0",
        port=PORT,
        debug=FLASK_DEBUG
    )

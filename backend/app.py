import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

from config import get_config
from routes.auth import auth_bp
from routes.curriculum import curriculum_bp
from routes.lesson import lesson_bp
from routes.doubt import doubt_bp

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


def create_app():
    app = Flask(__name__)
    config = get_config()
    app.config.from_object(config)

    CORS(app, resources={r"/*": {"origins": config.CORS_ORIGINS}})

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(curriculum_bp, url_prefix="/curriculum")
    app.register_blueprint(lesson_bp, url_prefix="/lesson")
    app.register_blueprint(doubt_bp, url_prefix="/doubt")

    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"})

    return app


if __name__ == "__main__":
    application = create_app()
    port = int(os.getenv("PORT", "8000"))
    application.run(host="0.0.0.0", port=port, debug=application.config.get("DEBUG", False))

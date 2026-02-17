from flask import Blueprint, jsonify, request

curriculum_bp = Blueprint("curriculum", __name__)


@curriculum_bp.get("/subjects")
def list_subjects():
    sample = [
        {"id": "sub-1", "name": "Mathematics", "class_level": "10"},
        {"id": "sub-2", "name": "Science", "class_level": "10"},
    ]
    return jsonify(sample)


@curriculum_bp.get("/chapters")
def list_chapters():
    subject_id = request.args.get("subject_id")
    sample = [
        {"id": "chap-1", "subject_id": subject_id or "sub-1", "title": "Algebra"},
        {"id": "chap-2", "subject_id": subject_id or "sub-1", "title": "Geometry"},
    ]
    return jsonify(sample)


@curriculum_bp.get("/topics")
def list_topics():
    chapter_id = request.args.get("chapter_id")
    sample = [
        {"id": "top-1", "chapter_id": chapter_id or "chap-1", "title": "Linear Equations"},
        {"id": "top-2", "chapter_id": chapter_id or "chap-1", "title": "Quadratic Equations"},
    ]
    return jsonify(sample)

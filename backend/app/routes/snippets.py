import logging
from flask import Blueprint, request, jsonify
from pydantic import ValidationError
from app.schemas import SnippetCreate, SnippetUpdate
from app.services import snippet_service

bp = Blueprint("snippets", __name__)
logger = logging.getLogger(__name__)

@bp.route("/snippets", methods=["POST"])
def create():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"error": "Invalid JSON"}), 400

    try:
        data = SnippetCreate(**body)
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": str(e)}), 422

    snippet = snippet_service.create_snippet(data)

    return jsonify(snippet.to_dict()), 201

@bp.route("/snippets", methods=["GET"])
def list_all():
    snippets = snippet_service.get_all_snippets()

    return jsonify([s.to_dict() for s in snippets])

@bp.route("/search", methods=["GET"])
def search():
    q = request.args.get("q", "").strip()
    lang = request.args.get("lang", "").strip() or None
    results = snippet_service.search_snippets(q, lang)

    return jsonify([s.to_dict() for s in results])

@bp.route("/snippets/<int:snippet_id>", methods=["PATCH"])
def update(snippet_id):
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({"error": "Invalid JSON"}), 400

    try:
        data = SnippetUpdate(**body)
    except ValidationError as e:
        return jsonify({"error": "Validation failed", "details": str(e)}), 422

    snippet = snippet_service.update_snippet(snippet_id, data)

    if not snippet:
        return jsonify({"error": "Snippet not found"}), 404

    return jsonify(snippet.to_dict())

@bp.route("/snippets/<int:snippet_id>", methods=["DELETE"])
def delete(snippet_id):
    deleted = snippet_service.delete_snippet(snippet_id)
    if not deleted:
        return jsonify({"error": "Snippet not found"}), 404
        
    return "", 204
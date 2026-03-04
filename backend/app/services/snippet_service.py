import logging
from app import db
from app.models import Snippet
from app.schemas import SnippetCreate, SnippetUpdate
from sqlalchemy import or_

logger = logging.getLogger(__name__)

def create_snippet(data: SnippetCreate) -> Snippet:
    snippet = Snippet(
        title=data.title,
        code=data.code,
        language=data.language,
        starred=data.starred,
    )
    snippet.tags = data.tags

    db.session.add(snippet)
    db.session.commit()

    logger.info(f"Created snippet id={snippet.id} lang={snippet.language}")

    return snippet

def get_all_snippets() -> list[Snippet]:
    return Snippet.query.order_by(Snippet.created_at.desc()).all()

def search_snippets(q: str, lang: str | None) -> list[Snippet]:
    query = Snippet.query

    if lang:
        query = query.filter(Snippet.language == lang.lower())

    if q:
        term = f"%{q.lower()}%"
        query = query.filter(
            or_(
                Snippet.title.ilike(term),
                Snippet._tags.ilike(term),
                Snippet.code.ilike(term),
            )
        )

    return query.order_by(Snippet.created_at.desc()).all()

def update_snippet(snippet_id: int, data: SnippetUpdate) -> Snippet | None:
    snippet = db.session.get(Snippet, snippet_id)
    if not snippet:
        return None

    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "tags":
            snippet.tags = value
        else:
            setattr(snippet, field, value)

    db.session.commit()

    logger.info(f"Updated snippet id={snippet_id}")

    return snippet

def delete_snippet(snippet_id: int) -> bool:
    snippet = db.session.get(Snippet, snippet_id)
    if not snippet:
        return False

    db.session.delete(snippet)
    db.session.commit()

    logger.info(f"Deleted snippet id={snippet_id}")
    
    return True
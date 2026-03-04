from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone
import json
from app import db

class Snippet(db.Model):
    __tablename__ = 'snippets'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    code = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(20), nullable=False, default='plaintext')
    starred = db.Column(db.Boolean, default=False)
    _tags = db.Column(db.Text, default='[]')  # JSON string '["flask","api"]'
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    @property
    def tags(self):
        return json.loads(self._tags or "[]")

    @tags.setter
    def tags(self, value: list):
        self._tags = json.dumps(value)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'code': self.code,
            'language': self.language,
            'starred': self.starred,
            'tags': self.tags,
            'created_at': self.created_at.isoformat()
        }

import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s"
)

def create_app(config_object=None):
    app = Flask(__name__)

    if config_object:
        app.config.from_object(config_object)
    else:
        from app.config import Config
        app.config.from_object(Config)
    
    db.init_app(app)
    
    from app.routes.snippets import bp
    app.register_blueprint(bp, url_prefix="/api")

    from app.errors import register_error_handlers
    register_error_handlers(app)


    with app.app_context():
        db.create_all()

    return app
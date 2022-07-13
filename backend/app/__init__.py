""" Top level module

This module:

- Contains create_app()
- Registers extensions
"""

from flask import Flask, send_from_directory
from flask_talisman import Talisman

# Import extensions
from .extensions import bcrypt, cors, db, jwt, ma

# Import config
from config import config_by_name


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config_by_name[config_name])

    register_extensions(app)

    # Register blueprints
    from .auth import auth_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")

    from .api import api_bp

    app.register_blueprint(api_bp, url_prefix="/api")

    @app.route('/static/<path:path>')
    def static_a(path):
        return send_from_directory('static', path)

    @app.route('/')
    def index():
        return send_from_directory('static/dist', 'index.html')

    @app.route('/<path:path>')
    def static_b(path):
        return send_from_directory('static/dist', path)

    return app


def register_extensions(app):
    # Registers flask extensions
    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app)

    talisman = Talisman(
        app,
        content_security_policy= None
        # {
        # 'default-src': [
        #     "'self'",
        #     "preview.babylonjs.com"
        # ],
        # 'img-src':[
        #     "'self' data: blob:",
        #     'imagesshowroom.s3.amazonaws.com'
        # ] ,
        # 'script-src':[
        #     "'self' 'unsafe-eval' blob: ",
        #     "cdn.jsdelivr.net",
        #     "preview.babylonjs.com"
        #
        # ],
        # 'style-src':[
        #     "'self' 'unsafe-inline'",
        #     "fonts.googleapis.com",
        #     "cdn.jsdelivr.net"
        # ],
        # 'font-src':[
        #     "'self'",
        #     'fonts.gstatic.com',
        #     "cdn.jsdelivr.net"
        # ]
        # }
    )

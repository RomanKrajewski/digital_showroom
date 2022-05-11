from flask_restx import Api
from flask import Blueprint

from .user.controller import api as user_ns
from .artwork.controller import api as artwork_ns
from .image.controller import api as image_ns

# Import controller APIs as namespaces.
api_bp = Blueprint("api", __name__)

api = Api(api_bp, title="API", description="Main routes.")

# API namespaces
api.add_namespace(user_ns)
api.add_namespace(artwork_ns)
api.add_namespace(image_ns)
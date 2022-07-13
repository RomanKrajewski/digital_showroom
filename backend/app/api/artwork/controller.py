from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restx import Resource
from flask import request

from app.models.schemas import ArtworkSchema
from app.utils import validation_error, err_resp
from .service import ArtworkService
from .dto import ArtworkDto

api = ArtworkDto.api
data_resp = ArtworkDto.data_resp


@api.route("/<int:artwork_id>")
class ArtworkDetails(Resource):
    @api.doc(
        "Get a specific artwork",
        responses={
            200: ("Artwork data successfully sent", data_resp),
            404: "Artwork not found!",
        },
    )
    def get(self, artwork_id):
        """ Get a specific artworks data by its id """
        return ArtworkService.get_artwork_data(artwork_id)

    @api.doc(
        "Modify the specified Artwork",
        responses={
            200: ("Artwork data successfully sent", data_resp),
            404: "Artwork not found!",
        },
    )
    @api.expect(ArtworkDto.artwork)
    @jwt_required()
    def post(self, artwork_id):
        """ Modify a scpecific artwork"""
        artwork_data = request.get_json()
        schema = ArtworkSchema()
        # Validate data
        if errors := schema.validate(artwork_data):
            return validation_error(False, errors), 400

        return ArtworkService.modify_artwork(artwork_id, artwork_data)

    @api.doc(
        "Delete the specified Artwork",
        responses={
            204: "Artwork data successfully deleted",
            404: "Artwork not found!",
        },
    )
    def delete(self, artwork_id):
        return ArtworkService.delete_artwork(artwork_id)


@api.route("/")
class ArtworkGeneral(Resource):
    @api.doc(
        "Get Artwork List",
        responses={
            200: ("Successfully retrieved artworks.", data_resp),
            404: "No artworks found.",
        },
    )
    def get(self):
        return ArtworkService.get_all_artworks()

    @api.doc(
        "Add new artwork",
        responses={
            201: ("Successfully added Artwork.", data_resp),
            400: "Malformed data or validations failed.",
        },
    )
    @api.expect(ArtworkDto.artwork)
    def post(self):
        artwork_data = request.get_json()
        schema = ArtworkSchema()
        # Validate data
        if errors := schema.validate(artwork_data):
            return validation_error(False, errors), 400

        return ArtworkService.add_artwork(artwork_data)

@api.route("/positioned")
class ArtworkPositioned(Resource):
    @api.doc(
        "Get all positioned artworks",
        responses={
            200: ("Successfully retreived Artworks.", data_resp),
            404: "No positioned Artworks found",
        },
    )

    def get(self):
        return ArtworkService.get_all_artworks_with_position()

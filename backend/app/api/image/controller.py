from flask_jwt_extended import jwt_required
from flask_restx import Resource
from flask import request

from app.models.schemas import ImageSchema
from app.utils import validation_error
from .service import ImageService
from .dto import ImageDto
import boto3


api = ImageDto.api



@api.route("/<int:image_id>")
class ImageGet(Resource):
    def get(self, image_id):
        """ Get a specific image by its id"""
        return ImageService.get_image_data(image_id)

@api.route("/")
class ImagePost(Resource):

    # @api.expect(ImageDto.image, validate=False)
    @jwt_required
    def post(self):
        image_data = request.get_data()
        schema = ImageSchema()
        # Validate data
        # if errors := schema.validate(image_data):
        #     return validation_error(False, errors), 400

        return ImageService.add_image(image_data)

@api.route("/s3_request")
class ImageS3Request(Resource):
    @jwt_required()
    def get(self):
        file_name = request.args.get('file_name')

        return ImageService.s3_request_auth(file_name)

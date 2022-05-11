from flask_jwt_extended import jwt_required
from flask_restx import Resource
from flask import request

from app.utils import validation_error
from .service import ImageService
from .dto import ImageDto
import boto3


api = ImageDto.api


@api.route("/s3_request")
class ImageS3Request(Resource):
    @jwt_required()
    def get(self):
        file_name = request.args.get('file_name')

        return ImageService.s3_request_auth(file_name)

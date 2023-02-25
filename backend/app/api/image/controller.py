from flask_jwt_extended import jwt_required
from flask_restx import Resource
from flask import request

from app.utils import validation_error
from .service import ImageService
from .dto import ImageDto
import boto3


api = ImageDto.api
s3_resp = ImageDto.s3_request_response

@api.route("/s3_request/<string:file_name>")
class ImageS3Request(Resource):
    @api.doc(
        "Request a presigned AWS S3 URL",
        responses={
            200: ("Presigned URL successfully sent", s3_resp),
        },
    )
    @jwt_required()
    def get(self, file_name):

        return ImageService.s3_request_auth(file_name)

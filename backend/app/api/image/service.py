import json
import os
import uuid
from pathlib import Path

import boto3
import botocore.awsrequest
import flask
from flask import current_app, request

from app import db
from app.utils import message, err_resp, internal_err_resp
from app.models.image import Image
from app.models.schemas import ImageSchema

class ImageService:
    image_path =  '/code/uploaded_images'
    @staticmethod
    def get_image_data(image_id):
        """ Get image data by id """
        if not (image := Image.query.filter_by(id=image_id).first()):
            return err_resp("Image not found!", "user_404", 404)

        try:
            return flask.send_file(f'{ImageService.image_path}/{image.filename}', 'image/png')

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def add_image(data):
        image_uuid = uuid.uuid4()
        image_filename = str(image_uuid) + '.png'
        image_filepath = f'{ImageService.image_path}/{image_filename}'
        try:
            with open(image_filepath, "wb") as image_file:
                image_file.write(data)

            new_image = Image()
            new_image.filename = image_filename
            db.session.add(new_image)
            db.session.flush()

            # Load the new images info
            schema = ImageSchema()
            image_info = schema.dump(new_image)

            # Commit changes to DB
            db.session.commit()

            resp = message(True, "Image has been added.")
            resp["image"] = image_info

            return resp, 201

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def delete_image(image_id):
        if not (image := Image.query.filter_by(id=image_id).first()):
            return err_resp("Image not found!", "user_404", 404)

        try:
            os.remove(f'{ImageService.image_path}/{image.filename}')
            db.session.delete(image)
            db.session.commit()
            return 204

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def s3_request_auth(file_name):
        s3_bucket = 'imagesshowroom'
        s3 = boto3.client('s3')
        uuid_string = str(uuid.uuid4())
        file_extension = Path(file_name).suffix
        key = uuid_string + file_extension
        presigned_url = s3.generate_presigned_url(
            'put_object',
            {'Bucket':s3_bucket,
            'Key':key},
            ExpiresIn=3600
        )
        resp = message(True, "Signed URL sent")
        resp["url"] = presigned_url
        return resp, 200

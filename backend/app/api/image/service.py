import json
import os
import uuid
from pathlib import Path

import boto3

from app.utils import message
class ImageService:

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

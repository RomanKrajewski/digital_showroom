from flask_restx import Namespace, fields


class ImageDto:

    api = Namespace("image", description="Image related operations.")
    s3_request_info = api.model(
        "S3 Request Info",
        {
            "file_name": fields.String(),
        },
    )
    s3_request_response = api.model(
        "S3 Request Response",
        {
            "url": fields.String(),
        }
    )

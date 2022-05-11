from flask_restx import Namespace, fields


class ImageDto:

    api = Namespace("image", description="Image related operations.")
    image = api.model(
        "Image Object",
        {
            "id": fields.Integer(),
        },
    )

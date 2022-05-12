from flask_restx import Namespace, fields


class ArtworkDto:

    api = Namespace("artwork", description="Artwork related operations.")

    vector = api.model(
        "Vector Object",
        {
            "x": fields.Float,
            "y": fields.Float,
            "z": fields.Float
        }
    )

    artwork = api.model(
        "Artwork Object",
        {
            "id": fields.Integer(),
            "name": fields.String(required=True),
            "width": fields.Integer(required=True),
            "height": fields.Integer(required=True),
            "image_url": fields.String(),
            "sold": fields.Boolean(required=True),
            "added_date": fields.DateTime,
            "position_vector": fields.Nested(vector),
            "orientation_vector": fields.Nested(vector)
        },
    )

    data_resp = api.model(
        "Artwork Data Response",
        {
            "status": fields.Boolean,
            "message": fields.String,
            "artwork": fields.Nested(artwork),
        },
    )

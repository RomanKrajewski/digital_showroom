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

    quaternion = api.model(
        "Quaternion Object",
        {
            "x": fields.Float,
            "y": fields.Float,
            "z": fields.Float,
            "w": fields.Float
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
            "technique": fields.String(required=True),
            "hyperlink_url":fields.String(),
            "year": fields.Integer(required=True),
            "sold": fields.Boolean(required=True),
            "added_date": fields.DateTime,
            "position_vector": fields.Nested(vector, allow_null=True),
            "orientation_quaternion": fields.Nested(quaternion, allow_null=True)
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

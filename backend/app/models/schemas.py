# Validations with Marshmallow
from marshmallow import Schema, fields, pre_dump, post_dump
from marshmallow.validate import Regexp, Length


class UserSchema(Schema):
    class Meta:
        # Fields to expose, add more if needed.
        fields = ("email", "name", "username", "joined_date", "role_id")

class VectorSchema(Schema):
    x = fields.Float()
    y = fields.Float()
    z = fields.Float()
    # class Meta:
    #     fields = ["id", "x", "y", "z"]
class QuaternionSchema(Schema):
    x = fields.Float()
    y = fields.Float()
    z = fields.Float()
    w = fields.Float()

class ArtworkSchema(Schema):

    @post_dump
    def remove_skip_values(self, data, **kwargs):
        return {
            key: value for key, value in data.items()
            if value is not None
        }

    class Meta:
        fields = ("id", "name", "width", "height", "sold", "added_date", "image_url", "orientation_quaternion", "position_vector")

    orientation_quaternion = fields.Nested(QuaternionSchema(only=["x", "y", "z", "w"]), allow_none=True)
    position_vector = fields.Nested(VectorSchema(only=["x", "y", "z"]), allow_none=True)


class LoginSchema(Schema):
    """ /auth/login [POST]

    Parameters:
    - Email
    - Password (Str)
    """

    email = fields.Email(required=True, validate=[Length(max=64)])
    password = fields.Str(required=True, validate=[Length(min=8, max=128)])


class RegisterSchema(Schema):
    """ /auth/register [POST]

    Parameters:
    - Email
    - Username (Str)
    - Name (Str)
    - Password (Str)
    """

    email = fields.Email(required=True, validate=[Length(max=64)])
    username = fields.Str(
        required=True,
        validate=[
            Length(min=4, max=15),
            Regexp(
                r"^([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)$",
                error="Invalid username!",
            ),
        ],
    )
    name = fields.Str(
        validate=[
            Regexp(
                r"^[A-Za-z]+((\s)?((\'|\-|\.)?([A-Za-z])+))*$", error="Invalid name!",
            )
        ]
    )
    user_add_password = fields.Str(required=True)
    password = fields.Str(required=True, validate=[Length(min=8, max=128)])

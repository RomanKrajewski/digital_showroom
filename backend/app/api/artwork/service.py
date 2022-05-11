import json

from flask import current_app

from app.api.image.service import ImageService
from app import db
from app.utils import message, err_resp, internal_err_resp
from app.models.artwork import Artwork
from app.models.vector import Vector
from app.models.schemas import ArtworkSchema, VectorSchema


class ArtworkService:
    @staticmethod
    def get_artwork_data(artwork_id):
        """ Get artwork data by id """
        if not (artwork := Artwork.query.filter_by(id=artwork_id).first()):
            return err_resp("Artwork not found!", "user_404", 404)

        try:
            schema = ArtworkSchema()
            artwork_data = schema.dump(artwork)

            resp = message(True, "Artwork data sent")
            resp["artwork"] = artwork_data
            return resp, 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def get_all_artworks():
        """ Get list of artwork ids """
        if not (artworks := Artwork.query.all()):
            return err_resp("No artworks", "user_404", 404)

        try:
            artwork_ids = [artwork.id for artwork in artworks]
            artwork_data = json.dumps(artwork_ids)

            resp = message(True, "Artwork data sent")
            resp["artwork"] = artwork_data
            return resp, 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def get_all_artworks_with_position():
        """ Get list of artwork ids """
        if not (artworks := Artwork.query.filter(Artwork.position_vector_id.is_not(None))):
            return err_resp("No artworks", "user_404", 404)
        try:
            artwork_ids = [artwork.id for artwork in artworks]
            artwork_data = json.dumps(artwork_ids)

            resp = message(True, "Artwork data with position sent")
            resp["artwork"] = artwork_data
            return resp, 200

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def add_artwork(data):
        name = data["name"]
        height = data["height"]
        width = data["width"]
        image_id = data["image_id"]
        image_url = data["image_url"]
        sold = data["sold"]
        try:
            new_artwork = Artwork(name=name, width=width, height=height, image_id=image_id, image_url=image_url, sold=sold)

            db.session.add(new_artwork)
            db.session.flush()

            if position_vector := data.get("position_vector", None):
                vector = Vector(x=position_vector["x"], y=position_vector["y"], z=position_vector["z"])
                db.session.add(vector)
                db.session.flush()
                new_artwork.position_vector_id = vector.id

            if orientation_vector := data.get("orientation_vector", None):
                vector = Vector(x=orientation_vector["x"], y=orientation_vector["y"], z=orientation_vector["z"])
                db.session.add(vector)
                db.session.flush()
                new_artwork.orientation_vector_id = vector.id

            schema = ArtworkSchema()
            artwork_info = schema.dump(new_artwork)

            db.session.commit()

            resp = message(True, "Artwork has been added.")
            resp["artwork"] = artwork_info

            return resp, 201

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def delete_artwork(artwork_id):
        if not (artwork := Artwork.query.filter_by(id=artwork_id).first()):
            return err_resp("Artwork not found!", "user_404", 404)

        try:
            ImageService.delete_image(artwork.image_id)
            db.session.delete(artwork)
            db.session.commit()
            return 204

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()

    @staticmethod
    def modify_artwork(artwork_id, data):
        name = data["name"]
        height = data["height"]
        width = data["width"]
        image_id = data["image_id"]
        image_url = data["image_url"]
        sold = data["sold"]

        try:
            if not (artwork := Artwork.query.filter_by(id=artwork_id).first()):
                return err_resp("Artwork not found!", "user_404", 404)
            artwork.name = name
            artwork.height = height
            artwork.width = width
            artwork.image_id = image_id
            artwork.sold = sold
            artwork.image_url = image_url

            if position_vector := data.get("position_vector", None):
                if not artwork.position_vector:
                    vector = Vector(x=position_vector["x"], y=position_vector["y"], z=position_vector["z"])
                    db.session.add(vector)
                    db.session.flush()
                    artwork.position_vector_id = vector.id
                else:
                    vector = Vector.query.filter_by(id=artwork.position_vector_id).first()
                    if not vector.compareWithDict(position_vector):
                        vector.x = position_vector["x"]
                        vector.y = position_vector["y"]
                        vector.z = position_vector["z"]

            if orientation_vector := data.get("orientation_vector", None):
                if not artwork.orientation_vector:
                    vector = Vector(x=orientation_vector["x"], y=orientation_vector["y"], z=orientation_vector["z"])
                    db.session.add(vector)
                    db.session.flush()
                    artwork.orientation_vector_id = vector.id
                else:
                    vector = Vector.query.filter_by(id=artwork.orientation_vector_id).first()
                    if not vector.compareWithDict(position_vector):
                        vector.x = orientation_vector["x"]
                        vector.y = orientation_vector["y"]
                        vector.z = orientation_vector["z"]


            db.session.commit()

            schema = ArtworkSchema()
            artwork_info = schema.dump(artwork)

            resp = message(True, "Artwork has been changed.")
            resp["artwork"] = artwork_info

            return resp, 201

        except Exception as error:
            current_app.logger.error(error)
            return internal_err_resp()
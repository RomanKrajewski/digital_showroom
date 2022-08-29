from datetime import datetime
from app import db, bcrypt

# Alias common DB names
Column = db.Column
Model = db.Model
relationship = db.relationship


class Artwork(Model):
    """ Artwork model for storing artwork related data """

    id = Column(db.Integer, primary_key=True)
    name = Column(db.String(64), unique=True, index=True)
    width = Column(db.Integer)
    height = Column(db.Integer)
    image_url = Column(db.String(85))
    sold = Column(db.Boolean)
    position_vector_id = Column(db.Integer, db.ForeignKey("vectors.id"))
    orientation_quaternion_id = Column(db.Integer, db.ForeignKey("quaternions.id"))
    technique = Column(db.String(100))
    year = Column(db.Integer)
    position_vector = db.relationship("Vector", foreign_keys=[position_vector_id])
    orientation_quaternion = db.relationship("Quaternion", foreign_keys=[orientation_quaternion_id])
    added_date = Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, **kwargs):
        super(Artwork, self).__init__(**kwargs)

    def __repr__(self):
        return f"<Artwork {self.name}>"
from datetime import datetime
from app import db, bcrypt

# Alias common DB names
Column = db.Column
Model = db.Model
relationship = db.relationship

class Image(Model):
    __tablename__ = 'images'
    id = Column(db.Integer, primary_key=True)
    filename = Column(db.String(128))
    added_date = Column(db.DateTime, default=datetime.utcnow)

    artwork = db.relationship("Artwork", backref="image", lazy="dynamic")

    def __init__(self, **kwargs):
        super(Image, self).__init__(**kwargs)

    def __repr__(self):
        return f"<Image {self.name}>"

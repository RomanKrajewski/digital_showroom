from app import db

# Alias common DB names
Column = db.Column
Model = db.Model
relationship = db.relationship

class Vector(Model):
    __tablename__ = 'vectors'
    id = Column(db.Integer, primary_key=True)
    x = Column(db.Float)
    y = Column(db.Float)
    z = Column(db.Float)


    # artwork = db.relationship("Artwork", backref="vector", lazy="dynamic")
    def compareWithDict(self, dict):
        return self.x == dict["x"] and self.y == dict["y"] and self.z == dict["z"]
    def __init__(self, **kwargs):
        super(Vector, self).__init__(**kwargs)

    def __repr__(self):
        return f"<Vector {self.name}>"

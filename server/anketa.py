from config import db
from sqlalchemy.types import TypeDecorator, Text
import json

class JsonEncodedList(TypeDecorator):
    impl = Text

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return json.dumps(value)  # Python list -> JSON string

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return json.loads(value)  # JSON string -> Python list

class Anketa(db.Model):
    __tablename__ = "Anketa"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('Korisnik.id'), nullable=False)  # Foreign key to Korisnik

    # This column stores a list of elements where each element is a dict 
    # such as {"text": "some question", "broj": 1}
    elementi = db.Column(JsonEncodedList, nullable=False, default=[])

    def __init__(self, name, user_id, elementi=None):
        self.name = name
        self.user_id = user_id
        self.elementi = elementi if elementi is not None else []

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'user_id': self.user_id,
            'elementi': self.elementi
        }

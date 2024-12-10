from config import db, bcrypt
from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property

class Korisnik(db.Model):
    __tablename__ = "Korisnik"
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ime = db.Column(db.String, nullable=False)
    prezime = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    lozinka = db.Column(db.String, nullable=False)

    def __init__(self, ime, prezime, email, lozinka):
        self.ime = ime
        self.prezime = prezime
        self.email = email
        self.lozinka = bcrypt.generate_password_hash(lozinka).decode('utf-8')  # Hash the password

    @validates('email')
    def validate_email(self, key, email):
        if not email or "@" not in email:
            raise ValueError("Invalid email address")
        return email
    
    def set_password(self, password):
        """Helper method to hash the password and set it."""
        self.lozinka = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Check the hashed password against the user input."""
        return bcrypt.check_password_hash(self.lozinka, password)  # Check hashed password

    def to_dict(self):
        """Convert the user object to a dictionary."""
        return {
            'id': self.id,
            'ime': self.ime,
            'prezime': self.prezime,
            'email': self.email,
        }

    def __repr__(self):
        return f"<Korisnik {self.ime} {self.prezime}, Email: {self.email}>"

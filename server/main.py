from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
from config import db, app  # Import db and app from config
from korisnik import Korisnik

# Configuration for Flask-Session
app.config['SESSION_TYPE'] = 'filesystem'  # Store session data on the filesystem
app.config['SESSION_PERMANENT'] = False    # Sessions are not permanent
app.config['SESSION_USE_SIGNER'] = True    # Encrypt session cookies

# Initialize session
Session(app)

# Initialize CORS with support for credentials
CORS(app, origins='http://localhost:3000', supports_credentials=True)  # Allow only localhost:3000 and support credentials

# Add dummy user to the database if not exists
def add_dummy_user():
    with app.app_context():  # Wrap the db interaction in an application context
        if not Korisnik.query.filter(Korisnik.email == "dummy@user.com").first():
            dummy_user = Korisnik(ime="Dummy", prezime="User", email="dummy@user.com", lozinka="password123")
            db.session.add(dummy_user)
            db.session.commit()

# Call the function to add the dummy user during app startup
add_dummy_user()

# Define routes
@app.route("/signup", methods=['POST'])
def signup():
    email = request.get_json().get('email')
    password = request.get_json().get('password')
    if email and password and not Korisnik.query.filter(Korisnik.email == email).first():
        new_user = Korisnik(email=email, lozinka=password)  # Create user and hash password in the model
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        return new_user.to_dict(), 201
    return {'error': '422 Unprocessable Entity'}, 422

@app.route("/login", methods=['POST'])
def login():
    data = request.get_json()
    print("Received data:", data)  # Log the received data
    email = data.get('email')
    password = data.get('password')
    print("Email:", email)
    print("Password:", password)

    user = Korisnik.query.filter(Korisnik.email == email).first()
    if user and user.check_password(password):  # Use check_password method to verify password
        session['user_id'] = user.id
        return user.to_dict(), 200
    return {'error': 'Unauthorized'}, 401

@app.route("/check_session", methods=['GET'])
def check_session():
    user = Korisnik.query.filter(Korisnik.id == session.get('user_id')).first()
    if user:
        return user.to_dict(), 200
    return {'error': 'Unauthorized'}, 401

@app.route("/logout", methods=['DELETE'])
def logout():
    if session.get('user_id'):
        session['user_id'] = None
        return {}, 204
    return {'error': 'Unauthorized'}, 401

# Basic Route
@app.route("/", methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the ap!"}), 200

# Run the app
if __name__ == "__main__":
    app.run(debug=True, port=5000)

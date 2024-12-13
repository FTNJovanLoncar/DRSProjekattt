from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
from config import db, app  # Import db and app from config
from korisnik import Korisnik

# Configuration for Flask-Session
app.config['SESSION_TYPE'] = 'filesystem'  # Store session data on the filesystem
app.config['SESSION_PERMANENT'] = False    # Sessions are not permanent
app.config['SESSION_USE_SIGNER'] = True    # Encrypt session cookies
#app.config['SESSION_COOKIE_SECURE'] = True  # Set to True for production with HTTPS

# Initialize session
Session(app)

# Initialize CORS with support for credentials
CORS(app, origins='http://localhost:3000', supports_credentials=True)  # Allow only localhost:3000 and support credentials

# Define routes
@app.route("/signup", methods=['POST'])
def signup():
    data = request.get_json()
    email=data.get('email')
    password=data.get('lozinka')
    name=data.get('ime')
    surname=data.get('prezime')
    print("Received data:", data)
    
    if Korisnik.query.filter(Korisnik.email == email).first():
     print("Email already exists")
     return {'error': 'Email already exists...'},423
    
    if password and name and surname and email:
     new_user = Korisnik(ime=name,prezime=surname,email=email, lozinka=password)  # Create user and hash password in the model
     db.session.add(new_user)
     db.session.commit()
     session['user_id'] = new_user.id
     return new_user.to_dict(), 201
    else:
     return {'error': 'Invalid input...'},423
  

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
    return jsonify({"message": "Welcome to the app!"}), 200

# Run the app
if __name__ == "__main__":
    app.run(debug=True, port=5000)

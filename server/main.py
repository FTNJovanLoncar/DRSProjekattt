from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
import sys
from config import db, app  # Import db and app from config
from korisnik import Korisnik
from anketa import Anketa
from anketa import JsonEncodedList
from flask_mail import Mail, Message
import logging
from sqlalchemy.orm.attributes import flag_modified

# Configuration for Flask-Session
app.config['SESSION_TYPE'] = 'filesystem'  # Store session data on the filesystem
app.config['SESSION_PERMANENT'] = False    # Sessions are not permanent
app.config['SESSION_USE_SIGNER'] = True    # Encrypt session cookies
# app.config['SESSION_COOKIE_SECURE'] = True  # Set to True for production with HTTPS
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # Use your email provider's SMTP server
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'zerobraine.lastloncar@gmail.com'  # Replace with your email
app.config['MAIL_PASSWORD'] = 'nwil njdj cjyx heuf'        # Replace with your password
app.config['MAIL_DEFAULT_SENDER'] = 'zerobraine.lastloncar@gmail.com'

mail = Mail(app)

# Initialize session
Session(app)

# Initialize CORS with support for credentials
CORS(app, origins='http://localhost:3000', supports_credentials=True)  # Allow only localhost:3000 and support credentials




@app.route('/send_survey', methods=['POST'])
def send_survey():
    print("ALO USLO SAM")
    data = request.get_json()
    emails = data.get('emails', [])
    survey = data.get('survey')

    if not emails or not survey:
        return {'error': 'Invalid input'}, 400

    subject = f"Survey: {survey['name']}"

    for email in emails:
        body = f"We invite you to participate in the survey: {survey['name']}\n\n"
        for idx, question in enumerate(survey['elementi']):
            body += f"{idx + 1}. {question['text']}\n"
            for i in range(1, 6):  # Ratings 1 to 5
                body += f"   {i}: http://localhost:5000/respond?anketa_id={survey['id']}&question={idx}&rating={i}\n"

        # Dodavanje glavnog linka za pregled ankete
        survey_link = f"http://localhost:3000/survey/{survey['id']}"
        body += f"\nTo review the survey and its details, click the link below:\n{survey_link}\n"

        try:
            msg = Message(subject, recipients=[email], body=body)
            mail.send(msg)
        except Exception as e:
            print(f"Error sending email to {email}: {e}")

    return {'message': 'Survey emails sent successfully'}, 200



@app.route('/respond', methods=['GET'])
def respond():
    anketa_id = request.args.get('anketa_id')
    question_idx = int(request.args.get('question'))
    rating = int(request.args.get('rating'))

    anketa = Anketa.query.get(anketa_id)
    
    if anketa:
        if question_idx < len(anketa.elementi):
            elementi = anketa.elementi
            question = elementi[question_idx]

            # Ažuriraj broj glasova (suma ocena)
            if 'broj' in question:
                question['broj'] += rating
            else:
                question['broj'] = rating  # Ako ne postoji, inicijalizuj

            # Ažuriraj broj ocena (koliko puta je ocenjeno)
            if 'broj_ocena' in question:
                question['broj_ocena'] += 1
            else:
                question['broj_ocena'] = 1

            # Izračunaj prosek za pitanje
            question['prosek'] = question['broj'] / question['broj_ocena']

            # Ažuriraj elemente i sačuvaj u bazi
            elementi[question_idx] = question
            anketa.elementi = elementi
            flag_modified(anketa, 'elementi')
            db.session.commit()

            print(f"Updated question {question_idx}: {question}")

            return jsonify({
                'message': 'Thank you for your response!',
                'updated_question': question,
                'updated_elementi': elementi
            }), 200
        else:
            return jsonify({'error': 'Invalid question index'}), 400
    return jsonify({'error': 'Anketa not found'}), 404








# Define routes
@app.route("/signup", methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('lozinka')
    name = data.get('ime')
    surname = data.get('prezime')
    print("Received data:", data)
    
    if Korisnik.query.filter(Korisnik.email == email).first():
        print("Email already exists")
        return {'error': 'Email already exists...'}, 423
    
    if password and name and surname and email:
        new_user = Korisnik(ime=name, prezime=surname, email=email, lozinka=password)  # Create user and hash password in the model
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        return new_user.to_dict(), 201
    else:
        return {'error': 'Invalid input...'}, 423
  

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

@app.route("/create", methods=['POST'])
def create():
    # Check if user is logged in
    if 'user_id' not in session:
        return {'error': 'User not logged in'}, 401

    data = request.get_json()
    print("Received data:", data)
    nazivAnkete = data.get('imeAnkete')
    listaAnkete = data.get('listaPitanja')
    userr_id = data.get('user_id')

    if not nazivAnkete or not listaAnkete:
        return {'error': 'Invalid input'}, 400

    print("Ime Ankete:", nazivAnkete)
    print("Pitanja:", listaAnkete)

    listaPunjenje = []
    for pitanje in listaAnkete:
        element = {"text": pitanje, "broj": 0}
        listaPunjenje.append(element)

    # Create a new Anketa associated with the logged-in user
    holder1 = Anketa(nazivAnkete, userr_id, listaPunjenje)
    db.session.add(holder1)
    db.session.commit()

    return 'OK', 200

# New route to fetch Anketa list for logged-in user
@app.route("/anketas", methods=["GET"])
def get_anketas():
    if 'user_id' not in session:
        return {"error": "User not logged in"}, 401
    
    user_id = session["user_id"]
    anketas = Anketa.query.filter_by(user_id=user_id).all()
    return jsonify([anketa.to_dict() for anketa in anketas]), 200


@app.route("/anketas/<int:anketa_id>", methods=["GET"])
def get_anketa(anketa_id):
    app.logger.info(f"Received request for Anketa with ID: {anketa_id}")

    anketa = Anketa.query.filter_by(id=anketa_id).first()
    app.logger.info(f"Query result: {anketa}")

    if not anketa:
        app.logger.warning(f"Anketa with ID {anketa_id} not found.")
        return {"error": "Anketa not found"}, 404

    app.logger.info(f"Returning Anketa: {anketa.to_dict()}")
    return anketa.to_dict(), 200


@app.route("/anketas/<int:anketa_id>", methods=["PUT"])
def update_anketa(anketa_id):
    if 'user_id' not in session:
        return {"error": "User not logged in"}, 401

    anketa = Anketa.query.filter_by(id=anketa_id, user_id=session['user_id']).first()
    if not anketa:
        return {"error": "Anketa not found"}, 404

    data = request.get_json()
    # Update the elementi if provided
    if 'elementi' in data:
        anketa.elementi = data['elementi']

    # You can also update `naziv` if sent
    if 'naziv' in data:
        anketa.naziv = data['naziv']

    db.session.commit()
    return anketa.to_dict(), 200




# Basic Route
@app.route("/", methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the app!"}), 200

# Run the app
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)


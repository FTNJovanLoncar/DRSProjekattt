from flask import Flask
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
import secrets
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

# Configure app settings
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'  # SQLite database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.secret_key = secrets.token_hex(16)

# SQLAlchemy configuration with custom naming convention
metadata = MetaData(naming_convention={  # Ensures foreign keys are named consistently
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

# Initialize database
db = SQLAlchemy(metadata=metadata)

# Initialize migration, bcrypt, API, and CORS
migrate = Migrate()
bcrypt = Bcrypt()
api = Api()
CORS(app)

# Initialize the app with the db instance
db.init_app(app)

# Initialize the extensions after db initialization
migrate.init_app(app, db)
bcrypt.init_app(app)
api.init_app(app)

# Don't run the application here, as you need it imported in main.py

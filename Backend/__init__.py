from flask import Flask
from config import Config
from models import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

jwt = JWTManager(app)

CORS(app)

with app.app_context():
    db.create_all()

import routes

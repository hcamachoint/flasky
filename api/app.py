from flask import Flask, request, jsonify, render_template, make_response
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask.cli import AppGroup
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_raw_jwt, get_jwt_identity

from datetime import datetime
from uuid import uuid4

#DEFINICIONES DE LA APP
app = Flask(__name__, template_folder='template')
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql://toor:toor@localhost/flasky"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'Super-Secret' #LLAVE DE LA JWT
app.config['JWT_BLACKLIST_ENABLED'] = True
app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

api = Api(app)
db = SQLAlchemy(app)
ma = Marshmallow(app)
blacklist = set()

CORS(app) #OPCIONAL PARA CORS
jwt = JWTManager(app) #OPCIONAL PARA JWT
bcrypt = Bcrypt(app) #OPCIONAL ENCRIPTAR CLAVES

#DEFINICION DE BASE DE DATOS
class User(db.Model): #SQLAlchemy
    id = db.Column(db.Integer, primary_key=True)
    pubic_id = db.Column(db.String(36), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=True)
    last_name = db.Column(db.String(50), nullable=True)
    username = db.Column(db.String(30), unique=True, nullable=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.String(50), nullable=True)

    def __init__(self, first_name, last_name, username, email, password):
        self.pubic_id = uuid4()
        self.first_name = first_name
        self.last_name = last_name
        self.username = username
        self.email = email
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
        self.created_at = datetime.utcnow()

class UserSchema(ma.Schema): #Marshmallow
    class Meta:
        fields = ('id', 'public_id', 'first_name', 'last_name', 'username', 'email', 'created_at')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

#DEFINICION DE VISTAS
class IndexView(Resource):
    def get(self):
        return "Index View"

class UserView(Resource):
    @jwt_required
    def get(self):
        data_token = get_jwt_identity()
        user = User.query.filter_by(username=data_token['username']).first()
        return user_schema.jsonify(user)

    @jwt_required
    def put(self):
        data_token = get_jwt_identity()
        user = User.query.filter_by(username=data_token['username']).first()

        if user:
            user.first_name = request.json['first_name']
            user.last_name = request.json['last_name']
            user.username = request.json['username']
            user.email = request.json['email']

            db.session.commit()
            return user_schema.jsonify(user)
        else:
            return jsonify({'msg': 'User not found'})

    @jwt_required
    def delete(self):
        data_token = get_jwt_identity()
        user = User.query.filter_by(username=data_token['username']).first()
        if user:
            db.session.delete(user)
            db.session.commit()

            jti = get_raw_jwt()['jti']
            blacklist.add(jti)
            return jsonify({'msg': 'User deleted', "status":200})
        else:
            return jsonify({'msg': 'User not found', "status":403})

#ESTA REVISA QUE EL TOKEN EXISTA PARA REVOCARLO(LOGOUT)
@jwt.token_in_blacklist_loader
def check_if_token_in_backlist(decrypted_token):
    jti = decrypted_token['jti']
    return jti in blacklist

class AuthView(Resource):
    def post(self):
        username = request.json['username']
        password = request.json['password']

        if not username:
            return jsonify({"msg":"Username is required", "status":403})
        if not password:
            return jsonify({"msg":"Password is required", "status":403})

        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({'msg': 'User not found', "status":403})

        if bcrypt.check_password_hash(user.password, password):
            access_token = create_access_token(identity={'first_name': user.first_name,'last_name': user.last_name, 'username': user.username, 'email': user.email})
            result = jsonify({'msg':'Invalid username and password', "token": access_token, "status":200})
        else:
            result = jsonify({'msg':'Invalid username and password', "status":403})

        return result

    @jwt_required
    def delete(self):
        jti = get_raw_jwt()['jti']
        blacklist.add(jti)
        return jsonify({'msg':'Successfully logut!'})

class RegisterView(Resource):
    def post(self):
        print('Error %s' % request.json)
        first_name = request.json['first_name']
        last_name = request.json['last_name']
        password = request.json['password']
        username = request.json['username']
        email = request.json['email']
        password = request.json['password']

        new_user = User(first_name, last_name, username, email, password)
        db.session.add(new_user)
        db.session.commit()
        return user_schema.jsonify(new_user)


#DEFINICION DE RUTAS
api.add_resource(IndexView, '/api/')
api.add_resource(UserView, '/api/user')
api.add_resource(AuthView, '/api/auth')
api.add_resource(RegisterView, '/api/register')

#ERROR HANDLER
@app.errorhandler(404)
def custom400(error):
    response = jsonify({'msg': error.description})
    return response

#DEFINICION DE COMANDOS PERSONALIZADOS
db_cli = AppGroup('migrate') #CREO EL GRUPO DE MIGRATE

@db_cli.command('create')
def create_tables():
    db.create_all()
    print("Tables Created!")

@db_cli.command('refresh')
def refresh_tables():
    db.drop_all()
    print("Tables Deleted!")

    db.create_all()
    print("Tables Created!")


@db_cli.command('reset')
def reset_tables():
    db.drop_all()
    print("Tables Deleted!")

@db_cli.command('seed')
def seed_tables():
    new_user = User('Admin', 'Server', 'admin', 'admin@local.dev', 'asd123')
    db.session.add(new_user)
    db.session.commit()
    print("Tables Seeds!")

app.cli.add_command(db_cli)

if __name__ == '__main__':
    app.run(debug=True)

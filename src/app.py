"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Paciente, Doctor, BloodPressure, Range, Recommendation, Availability, Appointment, BloodTest, UserRole
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)

app.url_map.strict_slashes = False

app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!-> os.getenv("JWT-KEY")
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# database condiguration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints


@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file


@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# @app.route('/signup_paciente', methods=['POST'])
# def signup_paciente():
#     body= request.get_json(silent=True)
#     if body is None:
#         return jsonify({'msg': "Body is empty"}), 400
#     if "email" not in body or "password" not in body or "nombre" not in body or "apellido" not in body or "confirm_password" not in body:
#         return jsonify({'msg':"Los campos, Email, Nombre, Apellido, Password y confirm_password son obligatorios"}), 400
    
#     if body['password'] != body['confirm_password']:
#         return jsonify({'msg': "Los passwords no coinciden"}), 400
    
#     if Paciente.query.filter_by(email=body['email']).first():
#         return jsonify({'msg': "El correo electronico ya está en uso"}), 400
    
#     if type == "paciente":
#         new_paciente = Paciente(
#         email=body['email'],
#         nombre = body['nombre'],
#         apellido = body ['apellido'],
#         password =bcrypt.generate_password_hash(body['password']).decode('utf-8'),
#         is_active=True

#     )

#     db.session.add(new_paciente)
#     db.session.commit()

#     return jsonify({'msg': 'Paciente creado exitosamente '}), 201

# @app.route('/login_paciente', methods=['POST'])
# def login_paciente(): 
#     body = request.get_json(silent=True)
#     if body is None:
#         return jsonify({'msg':'El cuerpo de la solicitud esta vacio'}), 400
#     if "email" not in body or "password" not in body:
#         return jsonify({'msg':'Email y password son obligatorios'}), 400
    
#     paciente = Paciente.query.filter_by(email=body['email']).first()
#     if paciente is None:
#         return jsonify({'msg': 'Usuario o password invalidos'}), 400
    
#     correct_password = bcrypt.check_password_hash(paciente.password, body['password'])
#     if not correct_password:
#         return jsonify({'msg': 'Usuario o password invalidos'}), 400
    
#     access_token = create_access_token(identity=paciente.id)
#     return jsonify({'msg':'Incicio de sesión exitoso', 'access_token': access_token}), 200

@app.route('/signup', methods=['POST'])
def signup():
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': "El cuerpo de la solicitud esta vacio"}), 400
    
    if "email" not in body:
        return jsonify({'msg': "El email es requerido"}), 400
    if "password" not in body:
        return jsonify({'msg': "El email es requerido"}), 400
    if "nombre" not in body:
        return jsonify({'msg': "El nombre es requerido"}), 400
    if "apellido" not in body:
        return jsonify({'msg': "El apellido es requerido"}), 400
    if "password" not in body:
        return jsonify({'msg': "El password es requerido"}), 400
    if "confirm_password" not in body:
        return jsonify({'msg': "La confirmación del password es requerida"}), 400
    if "type" not in body:
        return jsonify({"msg":"El campo type es requerido"}), 400
    
    if body ['password'] != body['confirm_password']:
        return jsonify({'msg': "Las contraseñas no coinciden"}), 400
     
    
    new_user = None
    if body['type'] == "paciente":
        new_user = Paciente()
    else:
        new_user = Doctor()

    new_user.email = body['email']     
    new_user.nombre=body['nombre'],
    new_user.apellido=body['apellido'],
    new_user.password=bcrypt.generate_password_hash(body['password']).decode('utf-8'),
    new_user.is_active=True

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'Usuario creado exitosamente'}), 201
    
@app.route('/login', methods=['POST'])
def login():
     body = request.get_json(silent=True)
     if body is None:
          return jsonify({'msg':"El cuerpo de la solicitud esta vacio"}), 400
     if "email" not in body or "password" not in body: 
          return jsonify({'msg':"El email y el password son obligatorios"}), 400
     
     doctor= Doctor.query.filter_by(email=body['email']).first()
     if doctor is None or not bcrypt.check_password_hash(doctor.password, body['password']):
          return jsonify({'msg': 'Correo electronico o password incorrectos'}), 400
     
     access_token = create_access_token(identity=doctor.id)
     return jsonify({'msg':'ok','access_token': access_token}), 200
     
@app.route('/profile/<int:id>', methods=['GET', 'POST'])
# @jwt_required()
def profile(id):
    if request.method == 'GET':
        #aca porceso todo lo que tenga que ver con el get
        # identity= get_jwt_identity()
        # print(identity)
        return jsonify({'msg':'Estoy haciendo un metodo GET'})
    elif request.method == 'POST':
        body = request.get_json(silent=True)
    
        if "type" not in body:
            return jsonify({'msg':"El campo type es requerido"}), 400
            
        if body["type"] == "paciente":
            numero_de_telefono = body['numero_de_telefono']
            fecha_de_nacimiento = body['fecha_de_nacimiento']
            sexo = body['sexo']
            update_data = Paciente()
            update_data.numero_de_telefono = numero_de_telefono
            update_data.fecha_de_nacimiento = fecha_de_nacimiento
            update_data.sexo = sexo
            #todo lo que se recibe en el body de paciente 
            #aca se llenan los campos faltantes
            return jsonify({'msg':'Estoy actualizando los campos del paciente'}), 201
        elif body["type"] == "doctor":
            especialidad = body['especialidad']
            numero_de_telefono = body['numero_de_telefono']
            direccion = body['direccion']
            ciudad = body['ciudad']
            estado = body['estado']
            costo = body['costo']
            numero_de_licencia = body['numero_de_licencia']
            
            update_data = Doctor()
            update_data.especialidad = especialidad
            update_data.numero_de_telefono = numero_de_telefono
            update_data.direccion = direccion
            update_data.ciudad = ciudad
            update_data.estado = estado
            update_data.costo = costo
            numero_de_licencia = numero_de_licencia
            #todo lo que se recibe en el body de doctor
            #aca se llenan los campos faltantes
            return jsonify({'msg':'Estoy actualizando los campos deldoctor'}), 201


    
   
# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

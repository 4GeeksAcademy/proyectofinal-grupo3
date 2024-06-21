"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Paciente, Doctor, Specialties, BloodPressure, Range, Recommendation, Availability, Appointment, BloodTest, UserRole
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

from flask_cors import CORS

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)

CORS(app)  # Permite todas las solicitudes de todos los orígenes

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

@app.route('/signup_paciente', methods=['POST'])
def signup_paciente():
    body= request.get_json(silent=True)
    if body is None:
        return jsonify({'msg': "Body is empty"}), 400
    if "email" not in body or "password" not in body or "nombre" not in body or "apellido" not in body or "confirm_password" not in body:
        return jsonify({'msg':"Los campos, Email, Nombre, Apellido, Password y confirm_password son obligatorios"}), 400
    
    if body['password'] != body['confirm_password']:
        return jsonify({'msg': "Los passwords no coinciden"}), 400
    
    if Paciente.query.filter_by(email=body['email']).first():
        return jsonify({'msg': "El correo electronico ya está en uso"}), 400
    
    new_paciente = Paciente(
        email=body['email'],
        nombre = body['nombre'],
        apellido = body ['apellido'],
        password =bcrypt.generate_password_hash(body['password']).decode('utf-8'),
        is_active=True

    )

    db.session.add(new_paciente)
    db.session.commit()

    return jsonify({'msg': 'Paciente creado exitosamente '}), 201

@app.route('/login_paciente', methods=['POST'])
def login_paciente(): 
    body = request.get_json(silent=True)
    if body is None:
        return jsonify({'msg':'El cuerpo de la solicitud esta vacio'}), 400
    if "email" not in body or "password" not in body:
        return jsonify({'msg':'Email y password son obligatorios'}), 400
    
    paciente = Paciente.query.filter_by(email=body['email']).first()
    if paciente is None:
        return jsonify({'msg': 'Usuario o password invalidos'}), 400
    
    correct_password = bcrypt.check_password_hash(paciente.password, body['password'])
    if not correct_password:
        return jsonify({'msg': 'Usuario o password invalidos'}), 400
    
    access_token = create_access_token(identity=paciente.id)
    return jsonify({'msg':'Incicio de sesión exitoso', 'access_token': access_token}), 200

@app.route('/signup_doctor', methods=['POST'])
def signup_doctor():
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
    
    if body ['password'] != body['confirm_password']:
         return jsonify({'msg': "Las contraseñas no coinciden"}), 400
    
    new_doctor = Doctor(
         email=body['email'],
         nombre=body['nombre'],
         apellido=body['apellido'],
         password=bcrypt.generate_password_hash(body['password']).decode('utf-8'),
         is_active=True
    )

    db.session.add(new_doctor)
    db.session.commit()

    return jsonify({'msg': 'Doctor creado exitosamente'}), 201
    
@app.route('/login_doctor', methods=['POST'])
def login_doctor():
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

#PROFILE DOCTOR Y PACIENTE
@app.route('/profile', methods=['GET', 'POST'])
#@jwt_required()
def profile():
    #identity = get_jwt_identity()
    # Simulación de una identidad para pruebas
    identity = 6  # Cambia este valor al ID del usuario doctor que deseas probar

    if request.method == 'GET':
        type = request.args.get('type') #pide sacar info de la url por eso la url tiene? type=doctor
        user = None

        if type == "paciente":
            user = Paciente.query.filter_by(id=identity).first()
        elif type == 'doctor':
            user = Doctor.query.filter_by(id=identity).first()

        if user:
            return jsonify({'msg': user.serialize()}), 200
        else:
            return jsonify({'msg': "El usuario no existe"}), 404

    elif request.method == 'POST': # otros metodos put delete elif request.method == 'PUT'
        try:
            body = request.get_json()
            if not body:
                return jsonify({'msg': 'Cuerpo de solicitud JSON no válido'}), 400

            if body["type"] == "paciente":
                numero_de_telefono = body.get('numero_de_telefono')
                fecha_de_nacimiento = body.get('fecha_de_nacimiento')
                sexo = body.get('sexo')

                # Validar que todos los campos necesarios estén presentes
                if not (numero_de_telefono and fecha_de_nacimiento and sexo):
                    return jsonify({'msg': 'Faltan campos obligatorios en la solicitud'}), 422

                # Actualizar los datos del paciente con el ID actual
                paciente = Paciente.query.filter_by(id=identity).first()
                if paciente:
                    paciente.numero_de_telefono = numero_de_telefono
                    paciente.fecha_de_nacimiento = fecha_de_nacimiento
                    paciente.sexo = sexo
                    # Guardar los cambios en la base de datos (dependiendo de tu configuración)
                    db.session.commit()
                    return jsonify({'msg': 'Campos del paciente actualizados correctamente'}), 201
                else:

                    return jsonify({'msg': 'Paciente no encontrado'}), 404

            elif body["type"] == "doctor":
                especialidad = body.get('especialidad')
                numero_de_telefono = body.get('numero_de_telefono')
                direccion = body.get('direccion')
                ciudad = body.get('ciudad')
                estado = body.get('estado')
                costo = body.get('costo')
                numero_de_licencia = body.get('numero_de_licencia')
                especialidades_adicionales = body.get('especialidades_adicionales')
                foto_perfil = body.get('foto_perfil')
                                

                # Validar que todos los campos necesarios estén presentes
                if not (especialidad and numero_de_telefono and direccion and ciudad and estado and costo and numero_de_licencia):
                    return jsonify({'msg': 'Faltan campos obligatorios en la solicitud'}), 422

                # Actualizar los datos del doctor con el ID actual
                doctor = Doctor.query.filter_by(id=identity).first()
                if doctor:
                    doctor.especialidad = especialidad
                    doctor.numero_de_telefono = numero_de_telefono
                    doctor.direccion = direccion
                    doctor.ciudad = ciudad
                    doctor.estado = estado
                    doctor.costo = costo
                    doctor.numero_de_licencia = numero_de_licencia
                    doctor.foto_perfil = foto_perfil
                    # Guardar los cambios en la base de datos (dependiendo de tu configuración)
                    db.session.commit()

                      # Manejo de especialidades adicionales
                    existing_specialties = {s.especialidades: s for s in doctor.especialidades_adicionales}
                    for specialty in especialidades_adicionales:
                        if specialty not in existing_specialties:
                            new_specialty = Specialties(doctor_id=doctor.id, especialidades=specialty)
                            db.session.add(new_specialty)
                    db.session.commit()


                    return jsonify({'msg': 'Campos del doctor actualizados correctamente'}), 201
                else:
                    return jsonify({'msg': 'Doctor no encontrado'}), 404

            else:
                return jsonify({'msg': 'Tipo de usuario no válido'}), 400

        except Exception as e:
            return jsonify({'msg': str(e)}), 500
 

#DOCTOR
@app.route('/api/doctors', methods=['GET'])
def doctors():
     doctors = Doctor.query.all()
     return jsonify([doctor.serialize() for doctor in doctors]), 200
    
@app.route('/api/doctors/<int:id>', methods=['GET'])
def doctor(id):
    doctor = Doctor.query.get(id)
    if doctor is None:
        return jsonify({"error": "Doctor not found"}), 404
    return jsonify(doctor.serialize()), 200



# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

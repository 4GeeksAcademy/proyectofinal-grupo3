"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Paciente, Doctor, BloodPressure, BloodPressureRange, Availability, Appointment, BloodTest, UserRole, BloodRange, RecommendationBloodPresure, RecommendationBloodTest, Specialties
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from datetime import datetime 

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

CORS(app, resources={
    r"/api/*": {
        "origins": ["https://expert-garbanzo-r446j4rj495qfpj76-3000.app.github.dev", "http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"],
    }
})

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
    if "type" not in body: 
        return jsonify({'msg':"El campo type es requerido"}), 400

    user = None
    if body['type'] == 'paciente':
        user= Paciente.query.filter_by(email=body['email']).first()
    elif body['type'] == 'doctor':
        user= Doctor.query.filter_by(email=body['email']).first()

    if user is None or not bcrypt.check_password_hash(user.password, body['password']):
        return jsonify({'msg': 'Correo electronico o password incorrectos'}), 400
     
    access_token = create_access_token(identity=user.id)
    return jsonify({'msg':'ok','access_token': access_token}), 200
     
# @app.route('/profile', methods=['GET', 'POST'])
# @jwt_required()
# def profile():
           
#     if request.method == 'GET':
#         body = request.get_json(silent=True)
#         identity= get_jwt_identity()
#         type = request.args.get('type')
#         user = None
             
#         if type == "paciente":
#             user = Paciente.query.filter_by(id=identity).first()
#             if user:
#                 return jsonify({'msg':user.serialize()}), 200
#             return jsonify({'msg': "El usuario no existe"}), 404
        
#         elif type == 'doctor':
#             user= Doctor.query.filter_by(id = identity).first()
#             if user:
#                 return jsonify({'msg':user.serialize()}), 200
#             return jsonify({'msg': "El usuario no existe"}), 404
            
#         return jsonify({'msg':'Parametros incorrectos'}), 400
    
#     elif request.method == 'POST':
#         #agregue nueva linea abajo
#         body = request.get_json(silent=True)  # Obtener datos JSON del cuerpo

#         if not body:
#             return jsonify({'msg': 'Cuerpo de solicitud JSON vacío'}), 400
        
#         if body["type"] == "paciente":
#             numero_de_telefono = body['numero_de_telefono']
#             fecha_de_nacimiento = body['fecha_de_nacimiento']
#             sexo = body['sexo']

#             update_data = Paciente()
#             update_data.numero_de_telefono = numero_de_telefono
#             update_data.fecha_de_nacimiento = fecha_de_nacimiento
#             update_data.sexo = sexo
#             #todo lo que se recibe en el body de paciente 
#             #aca se llenan los campos faltantes
#             return jsonify({'msg':'Estoy actualizando los campos del paciente'}), 201
        
#         elif body["type"] == "doctor":
#             especialidad = body['especialidad']
#             numero_de_telefono = body['numero_de_telefono']
#             direccion = body['direccion']
#             ciudad = body['ciudad']
#             estado = body['estado']
#             costo = body['costo']
#             numero_de_licencia = body['numero_de_licencia']
            
#             update_data = Doctor()
#             update_data.especialidad = especialidad
#             update_data.numero_de_telefono = numero_de_telefono
#             update_data.direccion = direccion
#             update_data.ciudad = ciudad
#             update_data.estado = estado
#             update_data.costo = costo
#             numero_de_licencia = numero_de_licencia
#             #todo lo que se recibe en el body de doctor
#             #aca se llenan los campos faltantes
#             return jsonify({'msg':'Estoy actualizando los campos del doctor'}), 
#             #nueva linea abaja
#         return jsonify({'msg': 'Tipo de usuario no válido'}), 400

@app.route('/profile', methods=['GET', 'POST'])
@jwt_required()
def profile():
    identity = get_jwt_identity()

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

@app.route('/appointments', methods=['POST'])
@jwt_required()
def create_appointment():
    body = request.get_json()
    required_fields = ['doctor_id', 'availability_id', 'message']

    if not body or not all(field in body for field in required_fields):
        return jsonify({'msg':'Faltan campos obligatorios'}), 400
    
    paciente_id = get_jwt_identity()
    doctor_id = body.get('doctor_id')
    availability_id = body.get('availability_id')
    message = body.get('message')

    if 'doctor_id' not in body:
        return jsonify({'msg':'EL campo doctor_id es obligatorios'}), 400
    if 'availability_id' not in body:
        return jsonify({'msg':'El campo availability_id es obligatorios'}), 400
    
    availability = Availability.query.get(availability_id)
    if not availability or availability.doctor_id != doctor_id:
        return jsonify({'msg': 'Disponibilidad no válida'}), 400

    new_appointment = Appointment(
        paciente_id=paciente_id,
        doctor_id=doctor_id,
        availability_id =availability_id,
        message=body.get('message'),
        appointment_date=datetime.utcnow()
    )

    
    db.session.add(new_appointment)
    db.session.commit()

    return jsonify({'msg':'Cita creada exitosamente'}), 201
   
@app.route('/paciente/<int:paciente_id>/appointments', methods=['GET'])
@jwt_required()
def get_pacient_appointments(paciente_id):
    appointments = Appointment.query.filter_by(paciente_id=paciente_id).all()
    appointment_list = [appointment.serialize() for appointment in appointments]
    return jsonify(appointment_list)

@app.route('/doctor/<int:doctor_id>/appointments', methods=['GET'])
@jwt_required()
def get_doctor_appointments(doctor_id):
    appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()
    appointment_list = [appointment.serialize() for appointment in appointments]
    return jsonify(appointment_list)

# ranges_data = [
#     {
#         "name": "Normal",
#         "systolic_min": 90,
#         "systolic_max": 120,
#         "diastolic_min": 60,
#         "diastolic_max": 80,
#         "heart_rate_min": 60,
#         "heart_rate_max": 100
#     },
#     {
#         "name": "Elevated",
#         "systolic_min": 120,
#         "systolic_max": 129,
#         "diastolic_min": 60,
#         "diastolic_max": 80,
#         "heart_rate_min": 60,
#         "heart_rate_max": 100

#     },
#     {
#         "name": "Hypertension Stage 1",
#         "systolic_min": 130,
#         "systolic_max": 139,
#         "diastolic_min": 80,
#         "diastolic_max": 89,
#         "heart_rate_min": 60,
#         "heart_rate_max": 100
#     },
#     {
#         "name": "Hypertension Stage 2",
#         "systolic_min": 140,
#         "systolic_max": 180,
#         "diastolic_min": 90,
#         "diastolic_max": 120,
#         "heart_rate_min": 60,
#         "heart_rate_max": 100
#     }
# ]

# try: 
#     for range_data in ranges_data:
#         new_range = BloodPressureRange(
#             name=range_data['name'],
#             systolic_min=range_data['systolic_min'],
#             systolic_max=range_data['systolic_max'],
#             diastolic_min=range_data['diastolic_min'],
#             diastolic_max=range_data['diastolic_max'],
#             heart_rate_min=range_data['heart_rate_min'],
#             heart_rate_max=range_data['heart_rate_max']

#         )
#         db.session.add(new_range)

#     db.session.commit()
#     print('rangos de presion arterial agregados correctamente')

# except Exception as e:
#     db.session.rollback()
#     print(f"Error al agregar los rangos de presión arterial: {str(e)}")
@app.route('/add_blood_pressure_range', methods=['POST'])
def add_blood_pressure_range():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Datos no proporcionados"}), 400

    try:
        new_range = BloodPressureRange(
            name=data['name'],
            systolic_min=data['systolic_min'],
            systolic_max=data['systolic_max'],
            diastolic_min=data['diastolic_min'],
            diastolic_max=data['diastolic_max'],
            heart_rate_min=data['heart_rate_min'],
            heart_rate_max=data['heart_rate_max']
        )

        db.session.add(new_range)
        db.session.commit()

        return jsonify({"message": "Rango de presión arterial agregado correctamente"}), 201

    except KeyError as e:
        return jsonify({"message": f"Campo requerido faltante: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"message": f"Error al agregar el rango de presión arterial: {str(e)}"}), 500
    
@app.route('/add_recommendation', methods= ['POST'])
def add_recommendation():
    data = request.get_json()

    if not data:
        return jsonify({'msg':'Datos no porporcionados'}), 400
    
    try:
        new_recommendation = RecommendationBloodPresure(
            text=data['text'],
            blood_pressure_range_id=data.get('blood_pressure_range_id'),
            range_id=data.get('blood_range_id')
        )

        db.session.add(new_recommendation)
        db.session.commit()

        return jsonify({"message": "Recomendación agregada correctamente"}), 201

    except KeyError as e:
        return jsonify({"message": f"Campo requerido faltante: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"message": f"Error al agregar la recomendación: {str(e)}"}), 500


@app.route('/blood_pressure_test', methods=['POST'])
def check_health():
    data = request.get_json()
    systolic = data.get('systolic')
    diastolic = data.get('diastolic')
    heart_rate = data.get('heart_rate')

    blood_pressure_range = BloodPressureRange.query.filter(
        BloodPressureRange.systolic_min <= systolic,
        BloodPressureRange.systolic_max >= systolic,
        BloodPressureRange.diastolic_min <= diastolic,
        BloodPressureRange.diastolic_max >= diastolic,
        BloodPressureRange.heart_rate_min <= heart_rate,
        BloodPressureRange.heart_rate_max >= heart_rate
    ).first()

    if blood_pressure_range.recommendations:
        for recommendation in blood_pressure_range.recommendations:
            return jsonify({"recommendation": recommendation.serialize()}) 
    else:
        return jsonify({"recommendation": "No specific recommendation found for the given values."}), 404

    


    

    

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

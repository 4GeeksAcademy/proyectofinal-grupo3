"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, send_from_directory

from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db, Paciente, Doctor, BloodPressure, BloodPressureRange, Availability, Appointment, BloodTest, UserRole, BloodRange, RecommendationBloodPresure, RecommendationBloodTest, Specialties, Contact, Review
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from datetime import datetime 
from api.helpers import get_user_by_email, generate_token, verify_token, send_reset_email

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt

from flask_mail import Mail, Message
from twilio.rest import Client 
from flask_cors import CORS


# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')


app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT-KEY") 
jwt = JWTManager(app)
bcrypt = Bcrypt(app)
CORS(app)

account_sid =  os.getenv('TWILIO_ACCOUNT_SID')
auth_token =   os.getenv('TWILIO_AUTH_TOKEN')  
twilio_client = Client(account_sid, auth_token)  

app.config.update(dict(
    DEBUG = False,
    MAIL_SERVER = 'smtp.gmail.com',
    MAIL_PORT = 587,
    MAIL_USE_TLS = True,
    MAIL_USE_SSL = False,
    MAIL_USERNAME = os.getenv('FLASK_MAIL_EMAIL'), 
    MAIL_PASSWORD = os.getenv('FLASK_MAIL_PASSWORD')

))

mail = Mail(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT-KEY")  
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = 3600
app.config['SECURITY_PASSWORD_SALT']= os.getenv("SECURITY_PASSWORD_SALT")
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

    try:
        msg = Message(
            subject="Hola correo de prueba desde la app Dr.Now",
            sender = os.getenv('FLASK_MAIL_EMAIL'),
            recipients=[body['email']]  # Correo del nuevo usuario
        )
        msg.html = '<h3>Bienvenido a la app Dr. Now</h3><p> Gracias por registrarte, {}</p>'.format(new_user.nombre)
        mail.send(msg)
    except Exception as e:
        return jsonify({'msg': 'Usuario creado pero ocurrio un error al enviar correo', 'error': str(e)}), 201
    
    return jsonify({'msg': 'Usuario creado exitosamente y correo enviado'}), 201

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
    elif body['type'] == 'doctors':
        user= Doctor.query.filter_by(email=body['email']).first()

    if user is None or not bcrypt.check_password_hash(user.password, body['password']):
        return jsonify({'msg': 'Correo electronico o password incorrectos'}), 400
     
    access_token = create_access_token(identity=user.id)
    return jsonify({'msg':'ok','access_token': access_token}), 200
    #no se cual es este estaba coemntada
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

#ruta de repo pasado la que funciona en postman
# @app.route('/profile', methods=['GET', 'POST'])
# @jwt_required()
# def profile():
#     identity = get_jwt_identity()

#     if request.method == 'GET':
#         type = request.args.get('type') #pide sacar info de la url por eso la url tiene? type=doctor
#         user = None

#         if type == "paciente":
#             user = Paciente.query.filter_by(id=identity).first()
#         elif type == 'doctor':
#             user = Doctor.query.filter_by(id=identity).first()

#         if user:
#             return jsonify({'msg': user.serialize()}), 200
#         else:
#             return jsonify({'msg': "El usuario no existe"}), 404

#     elif request.method == 'POST': # otros metodos put delete elif request.method == 'PUT'
#         try:
#             body = request.get_json()
#             if not body:
#                 return jsonify({'msg': 'Cuerpo de solicitud JSON no válido'}), 400

#             if body["type"] == "paciente":
#                 numero_de_telefono = body.get('numero_de_telefono')
#                 fecha_de_nacimiento = body.get('fecha_de_nacimiento')
#                 sexo = body.get('sexo')

#                 # Validar que todos los campos necesarios estén presentes
#                 if not (numero_de_telefono and fecha_de_nacimiento and sexo):
#                     return jsonify({'msg': 'Faltan campos obligatorios en la solicitud'}), 422

#                 # Actualizar los datos del paciente con el ID actual
#                 paciente = Paciente.query.filter_by(id=identity).first()
#                 if paciente:
#                     paciente.numero_de_telefono = numero_de_telefono
#                     paciente.fecha_de_nacimiento = fecha_de_nacimiento
#                     paciente.sexo = sexo
#                     # Guardar los cambios en la base de datos (dependiendo de tu configuración)
#                     db.session.commit()
#                     return jsonify({'msg': 'Campos del paciente actualizados correctamente'}), 201
#                 else:

#                     return jsonify({'msg': 'Paciente no encontrado'}), 404

#             elif body["type"] == "doctor":
#                 especialidad = body.get('especialidad')
#                 numero_de_telefono = body.get('numero_de_telefono')
#                 direccion = body.get('direccion')
#                 ciudad = body.get('ciudad')
#                 estado = body.get('estado')
#                 costo = body.get('costo')
#                 numero_de_licencia = body.get('numero_de_licencia')

#                 # Validar que todos los campos necesarios estén presentes
#                 if not (especialidad and numero_de_telefono and direccion and ciudad and estado and costo and numero_de_licencia):
#                     return jsonify({'msg': 'Faltan campos obligatorios en la solicitud'}), 422

#                 # Actualizar los datos del doctor con el ID actual
#                 doctor = Doctor.query.filter_by(id=identity).first()
#                 if doctor:
#                     doctor.especialidad = especialidad
#                     doctor.numero_de_telefono = numero_de_telefono
#                     doctor.direccion = direccion
#                     doctor.ciudad = ciudad
#                     doctor.estado = estado
#                     doctor.costo = costo
#                     doctor.numero_de_licencia = numero_de_licencia
#                     # Guardar los cambios en la base de datos (dependiendo de tu configuración)
#                     db.session.commit()
#                     return jsonify({'msg': 'Campos del doctor actualizados correctamente'}), 201
#                 else:
#                     return jsonify({'msg': 'Doctor no encontrado'}), 404

#             else:
#                 return jsonify({'msg': 'Tipo de usuario no válido'}), 400

#         except Exception as e:
#             return jsonify({'msg': str(e)}), 500


#PROFILE DOCTOR Y PACIENTE ruta cambiada no funciona ya la probe en postman
@app.route('/profile', methods=['GET', 'POST', 'PUT'])
@jwt_required()
def profile():
    identity = get_jwt_identity()
    # Simulación de una identidad para pruebas
    # identity = 4  # Cambia este valor al ID del usuario doctor que deseas probar

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
        

 
    elif request.method == 'PUT':
        try:
            body = request.get_json()
            if not body:
                return jsonify({'msg': 'Cuerpo de solicitud JSON no válido'}), 400

            if body["type"] == "paciente":
                # Lógica de actualización para pacientes
                pass

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

@app.route('/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()
    doctors_list = [{
        'id': doctor.id,
        'nombre': doctor.nombre,
        'apellido': doctor.apellido,
    } for doctor in doctors]

    return jsonify(doctors_list), 200
    
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
    required_fields = ['doctor_id', 'availability_id', 'message','appointment_date']
    if not body or not all(field in body for field in required_fields):
        return jsonify({'msg':'Faltan campos obligatorios'}), 400
    paciente_id = get_jwt_identity()
    doctor_id = body.get('doctor_id')
    availability_id = body.get('availability_id')
    message = body.get('message'),
    appointment_date = body.get('appointment_date')
    if 'doctor_id' not in body:
        return jsonify({'msg':'EL campo doctor_id es obligatorios'}), 400
    if 'availability_id' not in body:
        return jsonify({'msg':'El campo availability_id es obligatorios'}), 400
    if 'message' not in body:
        return jsonify({'msg':'El campo message es obligatorios'}), 400
    if 'appointment_date' not in body:
        return jsonify({'msg':'El campo appointment_name es obligatorios'}), 400
    availability = Availability.query.get(availability_id)
    if not availability or availability.doctor_id != doctor_id:
        return jsonify({'msg': 'Disponibilidad no válida'}), 400
    #esto lo puse nuevo
    if availability.is_booked:
        return jsonify({'msg': 'Esta disponibilidad ya está reservada'}), 400
    new_appointment = Appointment(
        paciente_id=paciente_id,
        doctor_id=doctor_id,
        availability_id =availability_id,
        message=message,
        appointment_date=appointment_date
    )
    doctor = Doctor.query.get(doctor_id)
    paciente = Paciente.query.get(paciente_id)
    try:
        db.session.add(new_appointment)
        #esto lo puse nuevo
        availability.is_booked = True
        db.session.commit()
        if new_appointment:
            if paciente.numero_de_telefono is not None:
                message_body = (
                f"Dr. Now: Su cita ha sido creada exitosamente con el.\n"
                f"Doctor: {doctor.nombre if doctor else 'N/A'} {doctor.apellido if doctor else 'N/A'} \n"
                f"Especialidad: {doctor.especialidad if doctor else 'N/A'}\n"
                f"Numero de telefono del Doctor: {doctor.numero_de_telefono if doctor else 'N/A'}\n"
                f"Dirección: {doctor.direccion if doctor else 'N/A'}, {doctor.ciudad if doctor else 'N/A'}, {doctor.estado if doctor else 'N/A'}\n"
                f"Paciente: {paciente.nombre if paciente else 'N/A'} {paciente.apellido if paciente else 'N/A'}\n"
                f"Mensaje: {message}\n"
                f"Fecha de la cita: {new_appointment.appointment_date.strftime('%Y-%m-%d %H:%M:%S')}"
            )
                twilio_message = twilio_client.messages.create(
                    body =message_body,
                    from_=os.getenv('TWILIO_PHONE_NUMBER'), # Número de Twilio
                    to=paciente.numero_de_telefono # Número del paciente
                )
                print(twilio_message.sid)
            # availability.is_booked = body.get("is_booked")
            # db.session.commit()
            return jsonify({'msg':'Cita creada exitosamente'}), 201
    except Exception as error:
        db.session.rollback()
        print(error)
        return jsonify({'msg': "Error al agendar la cita"}), 500

    
#Para que el paciente obtenga la cita con los datos prellenados en el Agenda
@app.route('/appointments', methods=['GET'])
@jwt_required()
def get_appointment_data():
    #body = request.get_json()
    paciente_id = get_jwt_identity()  # Cambia este valor al id de un paciente existente en tu base de datos
    #doctor_id = request.args.get('doctor_id')  # Cambia este valor al id de un doctor existente en tu base de datos
    #availability_id = request.args.get('doctor_id')  # Cambia este valor al id de disponibilidad adecuada

    #paciente_id = 1  # Cambia este valor al id de un paciente existente en tu base de datos
    #doctor_id = 6  # Cambia este valor al id de un doctor existente en tu base de datos
    #availability_id = 1  # Cambia este valor al id de disponibilidad adecuada

    paciente = Paciente.query.get(paciente_id)
    #doctor = Doctor.query.get(doctor_id)
    #availability = Availability.query.get(availability_id)

    #if not paciente or not doctor or not availability:
        #return jsonify({'msg': 'Datos no válidos'}), 400

    data = {
        'paciente': paciente.serialize(),
        #'doctor': doctor.serialize(),
        #'availability': availability.serialize(),
    }

    return jsonify(data), 200


#Para que el paciente obtenga sus citas   
@app.route('/paciente/<int:paciente_id>/appointments', methods=['GET'])
#@jwt_required()
def get_pacient_appointments(paciente_id):
    appointments = Appointment.query.filter_by(paciente_id=paciente_id).all()
    appointment_list = [appointment.serialize() for appointment in appointments]
    return jsonify(appointment_list)



#Para que el doctor desde su perfil pueda ver sus citas agendadas (MODAL)
@app.route('/doctor/<int:doctor_id>/appointments', methods=['GET'])
@jwt_required()
def get_doctor_appointments(doctor_id):
    appointments = Appointment.query.filter_by(doctor_id=doctor_id).all()
    appointment_list = [appointment.serialize() for appointment in appointments]
    return jsonify(appointment_list)

#Analisis Clinicos
@app.route('/add_blood_range', methods=['POST'])
def add_blood_range():
    body = request.get_json()

    if body is None:
        return jsonify({"message": "El cuerpo de la solicitud no debe estar vacio"}), 400
    
    if "name" not in body:
        return jsonify({"message": "El campo name no debe estar vacio"}), 400
    
    if "min_range" not in body:
        return jsonify({"message": "El campo min_range no debe estar vacio"}), 400
    
    if "max_range" not in body:
        return jsonify({"message": "El campo max_range no debe estar vacio"}), 400
    
    new_blood_test_range = BloodRange()
    new_blood_test_range.name = body['name'],
    new_blood_test_range.min_range = body['min_range'],
    new_blood_test_range.max_range = body['max_range']

    db.session.add(new_blood_test_range)
    db.session.commit()

    return jsonify({'msg':"blood_range agregado con exito"}), 201

@app.route('/add_blood_pressure_range', methods=['POST'])
def add_blood_pressure_range():
    body = request.get_json()
    if body is None:
        return jsonify({'msg':"El campo name es obligatorio"}),400
    if body is None:
        return jsonify({"message": "El cuerpo de la solicitud no debe estar vacio"}), 400
    if "systolic_min" is None:
        return jsonify({"message": "El campo systolic_min no debe estar vacio"}), 400
    if "systolic_max" is None:
        return jsonify({"message": "El campo systolic_max no debe estar vacio"}), 400
    if "diastolic_min" is None:
        return jsonify({"message": "El campo diastolic_min no debe estar vacio"}), 400
    if "diastolic_max" is None:
        return jsonify({"message": "El campo diastolic_max no debe estar vacio"}), 400
    if "heart_rate_min" is None:
        return jsonify({"message": "El campo heart_rate_min no debe estar vacio"}), 400
    if "heart_rate_max" is None: 
        return jsonify({"message": "El campo heart_rate_max no debe estar vacio"}), 400
    
    new_range = BloodPressureRange()
    new_range.name = body['name']
    new_range.systolic_min = body['systolic_min'],
    new_range.systolic_max = body['systolic_max'],
    new_range.diastolic_min = body['diastolic_min'],
    new_range.diastolic_max = body['diastolic_max'],
    new_range.heart_rate_min = body['heart_rate_min'],
    new_range.heart_rate_max = body['heart_rate_max']

    db.session.add(new_range)
    db.session.commit()

    return jsonify({'msg':'blood_range agregado con exito'}), 201


    # try:
    #     new_range = BloodPressureRange(
    #         name=body['name'],
    #         systolic_min=body['systolic_min'],
    #         systolic_max=body['systolic_max'],
    #         diastolic_min=body['diastolic_min'],
    #         diastolic_max=body['diastolic_max'],
    #         heart_rate_min=body['heart_rate_min'],
    #         heart_rate_max=body['heart_rate_max']
    #     )

    #     db.session.add(new_range)
    #     db.session.commit()

    #     return jsonify({"message": "Rango de presión arterial agregado correctamente"}), 201

    # except KeyError as e:
    #     return jsonify({"message": f"Campo requerido faltante: {str(e)}"}), 400
    # except Exception as e:
    #     return jsonify({"message": f"Error al agregar el rango de presión arterial: {str(e)}"}), 500


@app.route('/add_blood_presure_recommendation', methods= ['POST'])
def add_blood_pressure_recommendation ():
    body = request.get_json()

    if  body is None:
        return jsonify({'msg':'El cuerpo de la solicitod no puede estar vacio'}), 400
    
    if "blood_pressure_range_id" not in body:
        return jsonify({'msg':'El campo blood_pressure_range_id es obligatorio'}), 400
    
    if "text" not in body:
        return jsonify({'msg': "El campo text es obligatorio"}), 400
    
    new_recommendation = RecommendationBloodPresure()
    new_recommendation.blood_pressure_range_id = body['blood_pressure_range_id'],
    new_recommendation.text = body['text']

    db.session.add(new_recommendation)
    db.session.commit()

    return jsonify({'msg':"blood_pressure_recommendation creada con exito"}), 201

@app.route('/add_blood_test_recommendation', methods= ['POST'])
def add_blood_test_recommendation():
    body = request.get_json()

    # if body is None:
    #     return({'msg': 'El cuerpo de la solicitud no debe estar vacio'}), 400

    # if "name" not in body:
    #     return({'msg': 'El campo name no debe estar vacio'}), 400
    
    # if "text" not in body:
    #     return({'msg': 'El campo text no debe estar vacio'}), 400
    
    # if "min_range" not in body:
    #     return({'msg': 'El campo min_range no debe estar vacio'}), 400
    
    # if "max_range" not in body:
    #     return({'msg': 'El campo max_range no debe estar vacio'}), 400
    for recommendation in body:
        new_recommendation = RecommendationBloodTest(
            name=recommendation['name'],
            min_range=recommendation['min_range'], 
            max_range=recommendation['max_range'],  
            text=recommendation['recommendation'], 
            specialist=recommendation['specialist']  
        )
        db.session.add(new_recommendation)
    db.session.commit()
    return jsonify({"message": "Recommendation added successfully!"}), 200


@app.route('/doctor/<int:doctor_id>/availability', methods=['GET'])
@jwt_required()
def get_doctor_availability(doctor_id):
    # Obtener todas las disponibilidades del doctor que no estén reservadas
    availabilities = Availability.query.filter_by(doctor_id=doctor_id).all()
    # Convertir cada disponibilidad a un diccionario usando el método
    availabilities_list = [availability.serialize() for availability in availabilities]
    # availabilities_list = list(map(lambda availability: availability.serialize(), availabilities))
    # Devolver la lista de diccionarios como una respuesta JSON
    return jsonify(availabilities_list)

@app.route('/blood_pressure_form', methods=['POST']) 
def blood_pressure_form():
    body = request.get_json()
    systolic = body.get('systolic')
    diastolic = body.get('diastolic')
    heart_rate = body.get('heart_rate')

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

@app.route('/evaluate_blood_test', methods=['POST'])
def evaluate_blood_test():
    body = request.get_json()
    if body is None:
        return({'msg':'El cuerpo de la solicitud no debe estar vacio'}), 400
    
    recommendations = []

    

    def check_recommendation(value, name):
        try:
            float_value = float(value)
        except ValueError:
            return  # Manejar caso donde el valor no es convertible a float

        recs = RecommendationBloodTest.query.filter(RecommendationBloodTest.name.like(f"%{name}%")).all()
        for rec in recs:
            if rec.min_range <= float_value <= rec.max_range:
                recommendations.append({
                    "name": rec.name,
                    "text": rec.text,
                    "specialist": rec.specialist
                })
    #se ejecuta la funcion check_recommendation recibe valor y el nombre del examen que se hiso 
    check_recommendation(body.get('hemoglobina'), 'Hemoglobina')
    check_recommendation(body.get('hematocrito'), 'Hematocrito')
    check_recommendation(body.get('glicemia'), 'Glicemia')
    check_recommendation(body.get('colesterol'), 'Colesterol')
    check_recommendation(body.get('trigliceridos'), 'Trigliceridos')
    

    return jsonify({'recommendations': recommendations}), 200
   


@app.route('/contact', methods=['POST'])
def create_contact():
    data = request.get_json()
    full_name = data.get('fullName')
    email = data.get('email')
    comments = data.get('comments')

    if not full_name or not email or not comments:
        return jsonify({'error': 'Todos los campos son obligatorios'}), 400

    new_contact = Contact(full_name=full_name, email=email, comments=comments)
    db.session.add(new_contact)
    db.session.commit()

    return jsonify({'message': 'Formulario enviado correctamente!'}), 201


@app.route('/reviews', methods=['POST'])
@jwt_required()
def create_review():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    # Validar la entrada de datos
    if not data or not 'doctor_id' in data or not 'comentario' in data:
        return jsonify({'msg': 'Faltan datos requeridos'}), 400

    try:
        new_review = Review(
            doctor_id=data['doctor_id'],
            patient_id=current_user_id,
            comentario=data['comentario'],
            puntuacion=data.get('puntuacion', 5)  # Valor por defecto 5 si no se proporciona puntuación
        )
        db.session.add(new_review)
        db.session.commit()
        return jsonify({'msg': 'Reseña creada exitosamente'}), 201
    except Exception as e:
        return jsonify({'msg': f'Error al crear la reseña: {str(e)}'}), 400
    
    
    
@app.route('/reviews/doctor/<int:doctor_id>', methods=['GET'])
def get_reviews(doctor_id):
    reviews = Review.query.filter_by(doctor_id=doctor_id).all()
    reviews_list = [{
        'id': review.id,
        'doctor_id': review.doctor_id,
        'doctor_nombre': f"{review.doctor.nombre} {review.doctor.apellido}",  # Nombre completo del doctor
        'patient_id': review.patient_id,
        'patient_nombre': f"{review.patient.nombre} {review.patient.apellido}",  # Nombre completo del paciente
        'comentario': review.comentario,
        'puntuacion': review.puntuacion,
        'created_at': review.created_at
    } for review in reviews]

    return jsonify(reviews_list), 200

# @app.route('/reviews/doctor/<int:doctor_id>', methods=['GET'])
# def get_reviews(doctor_id):
#     reviews = Review.query.filter_by(doctor_id=doctor_id).all()
#     reviews_list = [review.serialize() for review in reviews]

#     return jsonify(reviews_list), 200

@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    body = request.get_json()

    if not body or 'email' not in body or 'user_type' not in body:
        return jsonify({'msg': 'El email y el tipo de ususario son requeridos'}), 400
    
    email = body['email']
    user_type = body['user_type']

    # Verifica que email sea una cadena antes de pasarlo a la función
    if not isinstance(email, str):
        return jsonify({'msg': 'El email debe ser una cadena válida'}), 400

    user = get_user_by_email(email, user_type)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
    token = generate_token(user)  # Generar el token usando email
    send_reset_email(user, token)

    return jsonify({'msg': 'Correo de restablecimiento de contraseña enviado'}), 200

@app.route('/reset_password/<token>', methods=['POST'])
def reset_password(token):
    body = request.get_json()

    if not body or 'password' not in body or 'confirm_password' not in body:
        return jsonify({'msg': 'La nueva contraseña y la confirmación son requeridas'}), 400
    
    if body['password'] !=body['confirm_password']:
        return jsonify({'msg': 'Las contraseñas no coinciden'}), 400
    
    user_id, user_type = verify_token(token)
    if user_type == 'paciente':
        user_info = Paciente.query.get(user_id)
        user_email = user_info.email
    else:
        user_info = Doctor.query.get(user_id)
        user_email = user_info.email
    print(verify_token(token))
    
    if not user_email:
        return jsonify({'msg': 'Token inválido o expirado'}), 400

    user = get_user_by_email(user_email, user_type)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
    user.password = bcrypt.generate_password_hash(body['password']).decode('utf-8')
    db.session.commit()

    return jsonify({'msg': 'Contraseña actualizada correctamente'}), 200

    
# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)

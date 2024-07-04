from flask_sqlalchemy import SQLAlchemy
from flask import Flask
from datetime import datetime
from enum import Enum
from sqlalchemy import Enum as SqlAlchemyEnum
from sqlalchemy import event
from sqlalchemy.orm import sessionmaker

db = SQLAlchemy()

class UserRole(Enum):
    PACIENTE = "paciente",
    DOCTOR = "doctor"

    def __repr__(self):
        return f'<User {self.email} {self.nombre} {self.apellido} {self.role}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "role": self.role.value,
            "is_active": self.is_active,
        }


class Paciente(db.Model):
    __tablename__= "paciente"
    id = db.Column(db.Integer, primary_key=True)
    # user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    # user = db.relationship('User', backref=db.backref('paciente', uselist=False))

    email = db.Column(db.String(120), unique=True, nullable=False)
    nombre = db.Column(db.String(120), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    numero_de_telefono = db.Column(db.String(15), nullable=True)
    fecha_de_nacimiento = db.Column(db.Date, nullable=True) 
    sexo = db.Column(db.String(10), nullable=True)

    pressures = db.relationship('BloodPressure', backref='paciente', lazy=True, cascade='all, delete-orphan')
    appointments = db.relationship('Appointment', backref='paciente', lazy=True, cascade='all, delete-orphan')
    blood_tests = db.relationship('BloodTest', backref='paciente', lazy=True, cascade='all, delete-orphan')
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<Paciente {self.email} {self.nombre} {self.apellido} {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            # "user_id": self.user_id,
            "email": self.email,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "numero_de_telefono": self.numero_de_telefono,
            "fecha_de_nacimiento": self.fecha_de_nacimiento,
            "sexo": self.sexo, 
            "is_active": self.is_active,
            # do not serialize the password, its a security breach
        }
    
class Availability(db.Model):
    __tablename__ = "availability"
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    # date = db.Column(db.DateTime, nullable=False, unique=False)
    day_of_week = db.Column(db.Integer, nullable=False)
    start_time = db.Column(db.Time, nullable=False)
    end_time = db.Column(db.Time, nullable=False)
    is_booked = db.Column(db.Boolean, default=False, nullable=False)
    

    def __repr__(self):
        return f'<Availability para el doctor {self.doctor_id} para el dia: {self.day_of_week} comienza: {self.start_time} termina: {self.end_time}>'

    def serialize(self):
        return {
            'id': self.id,
            'doctor_id': self.doctor_id,
            'day_of_week': self.day_of_week,
            'start_time': self.start_time.isoformat(),
            'end_time': self.end_time.isoformat(),
            # 'date': self.date,
            'is_booked': self.is_booked
        }

class Appointment(db.Model):
    __tablename__= "appointment"
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id'), nullable=False)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    availability_id = db.Column(db.Integer, db.ForeignKey('availability.id'), nullable=False)
    message = db.Column(db.String(200), nullable=True)
    appointment_date = db.Column(db.DateTime, nullable=False)
    availability = db.relationship('Availability', backref='appointment')

    def __repr__(self):
        return f'<Appointment {self.id}>'
    
    def serialize(self):
        doctor = Doctor.query.get(self.doctor_id)
        paciente = Paciente.query.get(self.paciente_id)

        return {
            'id': self.id,
            'paciente_id': self.paciente_id,
            'doctor_id': self.doctor_id,
            'doctor_name':doctor.nombre if doctor else None,
            'doctor_last_name': doctor.apellido if doctor else None,
            'doctor_especialidad': doctor.especialidad if doctor else None,
            'doctor_phone_number': doctor.numero_de_telefono if doctor else None,
            'doctor_address': doctor.direccion if doctor else None,
            'doctor_city': doctor.ciudad if doctor else None,
            'doctor_state': doctor.estado if doctor else None,
            'pacient_name': paciente.nombre if paciente else None,
            'pacient_last_name': paciente.apellido if paciente else None,
            'message': self.message,
            'availability': self.availability.serialize() if self.availability else None,
            'appointment_date': self.appointment_date.isoformat(),
        }
    
class Doctor(db.Model):
    __tablename__= "doctor"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(50), nullable=False)
    apellido = db.Column(db.String(50), nullable=False)
    especialidad = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    numero_de_telefono = db.Column(db.String(15), nullable=True)
    password = db.Column(db.String(80), unique=False, nullable=False)
    direccion = db.Column (db.String(100), nullable=True)
    ciudad = db.Column(db.String(50), nullable=True)
    estado = db.Column (db.String(50), nullable=True)
    costo = db.Column(db.Float, nullable=True)
    numero_de_licencia = db.Column(db.String, nullable=True)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    destacado = db.Column(db.Boolean(), default=False, nullable=False)  # Nuevo campo
    foto_perfil = db.Column(db.String(255), nullable=True)  # Nuevo campo para la foto de perfil
    numero_de_resenas = db.Column(db.Integer, default=0, nullable=False)  # Nuevo campo para el número de reseñas

    appointments = db.relationship('Appointment', backref='doctor_relationship', lazy=True)
    availabilities = db.relationship('Availability', backref='doctor', lazy=True, uselist=True)
    #reviews = db.relationship('Review', back_populates='doctor', lazy=True)  # Relación con la tabla de reseñas
    reviews_list = db.relationship('Review', back_populates='doctor', lazy=True)  # Cambiado a 'reviews_list' para evitar conflicto
    especialidades_adicionales = db.relationship('Specialties', backref='doctor', lazy=True)  # Relación con la tabla Specialty
    # horario = db.Column(db.Date, nullable=True) # que tipo de dato va? date o dateTime diferencia? tabla -> disponibilidad_doctor

    def __repr__(self):
        return f'<Doctor {self.email} {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "especialidad": self.especialidad,
            "email": self.email,
            "numero_de_telefono": self.numero_de_telefono,
            "direccion": self.direccion,
            "ciudad": self.ciudad,
            "estado": self.estado,
            "costo": self.costo,
            "numero_de_licencia": self.numero_de_licencia,
            "is_active": self.is_active,
            "destacado": self.destacado,
            "foto_perfil": self.foto_perfil,
            "numero_de_resenas": self.numero_de_resenas,  # Serialización del número de reseñas
            "availabilities": [availability.serialize() for availability in self.availabilities], 
            #"reviews": [review.serialize() for review in self.reviews],  # Serialización de las reseñas
            "reviews": [review.serialize() for review in self.reviews_list],  # Serialización de las reseñas
            "especialidades_adicionales": [especialidad.serialize() for especialidad in self.especialidades_adicionales]
            # do not serialize the password, its a security breach
        }
    
class RecommendationBloodTest(db.Model):
    __tablename__="recommendation_blood_test"
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    name = db.Column(db.Text, nullable=False)
    min_range = db.Column(db.Float, nullable=False)
    max_range = db.Column(db.Float, nullable=False)
    specialist = db.Column(db.Text, nullable=False)

    # blood_pressures = db.relationship('BloodRange', backref='recommendation_blood_range', lazy=True, viewonly=True)

    def __repr__(self):
        return f'<Recommendation {self.id} {self.name} {self.text}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'text': self.text,
            'name': self.name,
            'min_range': self.min_range,
            'max_range': self.max_range,
            'specialist': self.specialist
        }
    
class RecommendationBloodPresure(db.Model):
    __tablename__="recommendation_blood_pressure"
    id = db.Column(db.Integer, primary_key=True)
    blood_pressure_range_id = db.Column(db.Integer, db.ForeignKey('blood_pressure_range.id'), nullable=True)
    text = db.Column(db.Text, nullable=False)
    # blood_pressures = db.relationship('BloodPressureRange', backref='recommendation_blood_pressure', lazy=True, viewonly=True)

    def __repr__(self):
        return f'<Recommendation {self.id}>'
    
    def serialize(self):
        return {
            'id': self.id,
            'blood_pressure_range_id': self.blood_pressure_range_id,
            'text': self.text
        }
#     
# class Recommendation(db.Model):
#     __tablename__="recommendation"
#     id = db.Column(db.Integer, primary_key=True)
#     blood_pressure_range_id = db.Column(db.Integer, db.ForeignKey('blood_pressure_range.id'), nullable=True)
#     blood_range_id = db.Column(db.Integer, db.ForeignKey('blood_range.id'), nullable=True)
#     text = db.Column(db.Text, nullable=False)
#     blood_pressures = db.relationship('BloodPressure', backref='recommendation', lazy=True, viewonly=True)

#     def __repr__(self):
#         return f'<Recommendation {self.id}>'
    
#     def serialize(self):
#         return {
#             'id': self.id,
#             'blood_pressure_range_id': self.blood_pressure_range_id,
#             'blood_range_id': self.blood_range_id,
#             'text': self.text
#         }
    
class BloodPressure(db.Model):
    __tablename__ = "blood_pressure"
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id', ondelete='CASCADE'), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    systolic = db.Column(db.Integer, nullable=False)
    diastolic = db.Column(db.Integer, nullable=False)
    heart_rate = db.Column(db.Integer, nullable=False)

    recommendation_id = db.Column(db.Integer, db.ForeignKey('recommendation_blood_pressure.id'), nullable=True)

    recommendation = db.relationship('RecommendationBloodPresure', backref='blood_pressure', lazy=True)

    
    
    # paciente = db.relationship('Paciente', back_populates='pressures', overlaps="paciente_pressure")
    
    def __repr__(self):
        return f'<BloodPressure {self.id}>'

    def serialize(self):
        return {
            'id': self.id,
            'paciente_id': self.paciente_id,
            'systolic': self.systolic,
            'diastolic': self.diastolic,
            'heart_rate': self.heart_rate,
            'date': self.date,
            'recommendation_id': self.recommendation_id
        }
    
class BloodTest(db.Model):
    __tablename__ = "blood_test"
    id = db.Column(db.Integer, primary_key=True)
    paciente_id = db.Column(db.Integer, db.ForeignKey('paciente.id', ondelete='CASCADE'), nullable=False)    
    date = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    glicemia = db.Column(db.Float, nullable=True)
    colesterol = db.Column(db.Float, nullable=True)
    trigliceridos = db.Column(db.Float, nullable=True)
    hematocritos = db.Column(db.Float, nullable=True)
    hemoglobina = db.Column(db.Float, nullable=True)

   
    # paciente = db.relationship('Paciente', backref='blood_tests', lazy=True)

    def __repr__(self):
        return f'<BloodTest {self.id}>'

    def serialize(self):
        return {
            'id': self.id,
            'paciente_id': self.paciente_id,
            'date': self.date,
            'glicemia': self.glicemia,
            'colesterol': self.colesterol,
            'trigliceridos': self.trigliceridos,
            'hematocritos': self.hematocritos,
            'hemoglobina': self.hemoglobina
        }


class BloodPressureRange(db.Model):
    __tablename__= "blood_pressure_range"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=True)
    systolic_min = db.Column(db.Integer, nullable=True)
    systolic_max = db.Column(db.Integer, nullable=True)
    diastolic_min = db.Column(db.Integer, nullable=True)
    diastolic_max = db.Column(db.Integer, nullable=True)
    heart_rate_min = db.Column(db.Integer, nullable=True)
    heart_rate_max = db.Column(db.Integer, nullable=True)
    
    recommendations = db.relationship('RecommendationBloodPresure', backref='blood_pressure_range', lazy=True) #primaryjoin="and_(BloodPressureRange.id == Recommendation.range_id)"
 


    def __repr__(self):
        return f'<Range {self.name} {self.id}>' 

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'systolic_min': self.systolic_min,
            'systolic_max': self.systolic_max,
            'diastolic_min': self.diastolic_min,
            'diastolic_max': self.diastolic_max,
        }

   
class BloodRange(db.Model):
    __tablename__ = "blood_range"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=True)
    min_range = db.Column(db.Float, nullable=True)
    max_range = db.Column(db.Float, nullable=True)
    
    # recommendation = db.relationship('RecommendationBloodTest', backref="blood_range", lazy=True)

    def __repr__(self):
        return f'<Range {self.name} {self.id}>' 
    
    def serialize(self):
        return{
            'id': self.id,
            'name': self.name,
            'min_range': self.min_range,
            'max_range': self.max_range

        }

    # Añade los demás campos necesarios aquí

class Review(db.Model):
    __tablename__ = "review"
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    patient_id = db.Column(db.Integer, db.ForeignKey('paciente.id'), nullable=False)
    comentario = db.Column(db.String(500), nullable=False)
    puntuacion = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    doctor = db.relationship('Doctor', backref=db.backref('reviews', lazy=True))# Mantenido como 'reviews' aquí
    patient = db.relationship('Paciente', backref=db.backref('patient_reviews', lazy=True))# Cambiado a 'patient_reviews'

    #doctor = db.relationship('Doctor', backref=db.backref('reviews', lazy=True))
    #patient = db.relationship('Paciente', backref=db.backref('reviews', lazy=True))

    def __repr__(self):
        return f'<Review {self.id} for Doctor {self.doctor_id} by Patient {self.patient_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "doctor_id": self.doctor_id,
            "patient_id": self.patient_id,
            "patient_nombre": f"{self.patient.nombre} {self.patient.apellido}",  # Incluyendo el nombre completo del paciente
            "comentario": self.comentario,
            "puntuacion": self.puntuacion,
            "created_at": self.created_at.isoformat()  # Convertir a string en formato ISO 8601
        }


# Eventos para actualizar el número de reseñas
@event.listens_for(Review, 'after_insert')
def after_insert_review(mapper, connection, target):
    doctor_id = target.doctor_id
    Session = sessionmaker(bind=db.engine)
    session = Session()
    doctor = session.query(Doctor).filter_by(id=doctor_id).first()
    if doctor:
        doctor.numero_de_resenas += 1
        session.commit()
    session.close()

@event.listens_for(Review, 'after_delete')
def after_delete_review(mapper, connection, target):
    doctor_id = target.doctor_id
    Session = sessionmaker(bind=db.engine)
    session = Session()
    doctor = session.query(Doctor).filter_by(id=doctor_id).first()
    if doctor and doctor.numero_de_resenas > 0:
        doctor.numero_de_resenas -= 1
        session.commit()
    session.close()



class Specialties(db.Model):
    __tablename__ = "specialties"
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.Integer, db.ForeignKey('doctor.id'), nullable=False)
    especialidades = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return f'<Specialties {self.especialidades} for Doctor {self.doctor_id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "doctor_id": self.doctor_id,
            "especialidades": self.especialidades
        }


class Contact(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    comments = db.Column(db.Text, nullable=False)

    def __repr__(self):
        return f'<Contact {self.full_name}>'
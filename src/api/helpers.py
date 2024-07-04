
import jwt
from flask import url_for, current_app, render_template
from flask_mail import Mail, Message
from flask_jwt_extended import create_access_token, decode_token
from flask_bcrypt import Bcrypt
from api.models import Paciente, Doctor
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature

bcrypt = Bcrypt()
mail = Mail()

#funcion para obtener usuario por email
def get_user_by_email(email, user_type):
    print(email)
    print(type(email))
    if not isinstance(email, str):
        raise ValueError("El email debe ser una cadena")


    if user_type == 'paciente':
        return Paciente.query.filter_by(email=email).first()

    elif user_type == 'doctor':
        return Doctor.query.filter_by(email=email).first()
    return None

# Función para generar token
def generate_token(user):
    user_type= 'paciente' if isinstance(user, Paciente) else 'doctor'
    additional_claims = {
        'user_type': user_type
    }

    access_token = create_access_token (identity=user.id, additional_claims=additional_claims)
    return access_token

#funcion para verificar token

def verify_token(token):
    try:
        payload = decode_token(token)
        user_email = payload['sub'] # 'sub' es. la clave predeterminada para el ID del usuario en flask_jwt_ectended
        user_type = payload['user_type']
        return user_email, user_type
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
    
def send_reset_email(user, token):
    reset_url = f"https://sample-service-name-w90y.onrender.com/reset_password/?token={token}"
    html = render_template('reset_password.html', reset_url=reset_url)
    msg = Message('Restablecer su password', sender=current_app.config['MAIL_USERNAME'], recipients=[user.email])
    msg.html = html


    mail.send(msg)
    
# def send_reset_email(user, token):
#     reset_url = url_for('reset_password', token=token, _external=True, _scheme='https')
   
#     reset_url.replace('https://localhost:3001', 'https://curly-fishstick-jj5q776r4xv5355v5-3000.app.github.dev')
    
#     msg = Message('Restablecer su password', sender=current_app.config['MAIL_USERNAME'], recipients=[user.email])
#     msg.body = f'''Para restablecer su password, haga clic en el siguiente enlace:
# {reset_url}
# Si no solicitó este cambio, ignore este correo electrónico.
# '''
#     mail.send(msg)    


    #funcion para enviar correo electronico de restablecimiento de contraseña 

# def send_reset_email(user, token):
#     reset_url = url_for('reset_password', token=token, _external=True _scheme='https')
#     msg = Message('Restablecer su password', sender=current_app.config['MAIL_USERNAME'], recipients=[user.email])
#     msg.body = f'''Para restablecer su password, haga clic en el siguiente enlace:
# {reset_url}
# Si no solicitó este cambio, ignore este correo electronico.
# '''
#     mail.send(msg)


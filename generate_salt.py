import secrets
import string

#define los caracteres permitidos para la genereacion de la cadena aleatoria
characters = string.ascii_letters + string.digits + string.punctuation 

#define la longitud de la cadena aleatoria 
length = 32 #ajusta la longitud segun tus necesidades de seguridad

#genera la cadena aleatoria 

security_salt = ''.join(secrets.choice(characters)for i in range(length)) 

print ('cadena aleatoria generada', security_salt)

#correr en la terminal el comando $python3 generate_salt.py 
# desde la raiz del documento 
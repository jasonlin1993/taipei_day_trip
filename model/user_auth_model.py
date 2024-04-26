from data.database import pool
import jwt
import datetime
import os

SECRET_KEY = os.getenv('SECRET_KEY')

def authenticate_user(email, password):
    with pool.get_connection() as connection:
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM member WHERE email = %s", (email,))
            user = cursor.fetchone()
    if user and user['password'] == password:
        payload = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return True, token
    elif user:
        return False, 'wrong_password'
    else:
        return False, 'unregistered_email'

def validate_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return True, payload
    except jwt.ExpiredSignatureError:
        return False, 'Token已過期'
    except jwt.InvalidTokenError:
        return False, '無效的Token'

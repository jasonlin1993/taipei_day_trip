from flask import request
from flask import jsonify
import jwt
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

def verify_jwt_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, jsonify({'error': True, 'message': '未登入系統，拒絕存取'}), 403

    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify({'error': True, 'message': 'Token已過期'}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({'error': True, 'message': '無效的Token'}), 401
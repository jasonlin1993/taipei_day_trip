from flask import Blueprint
from flask import request
from flask import jsonify
from data.database import pool  # 請根據你的目錄結構修改這裡的 import
import jwt
import datetime



user_auth_api = Blueprint('user_auth_api', __name__)

SECRET_KEY = 'this_is_my_secret_key'

@user_auth_api.route("http://54.214.247.228:3000/api/user/auth", methods=["GET", "PUT"])
def user_auth():
    if request.method == 'PUT':
        return put_user_auth()
    elif request.method == 'GET':
        return get_user_auth()

def put_user_auth():
    email = request.json.get('email')
    password = request.json.get('password')
    
    connection = pool.get_connection()
    cursor = connection.cursor(dictionary=True)
    
    cursor.execute("SELECT * FROM member WHERE email = %s", (email,))
    user = cursor.fetchone()
    
    cursor.close()
    connection.close()
    
    if user and user['password'] == password:  # 使用明文密碼進行比較
        payload = {
            'id': user['id'],
            'name': user['name'],
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
        return jsonify({'token': token}), 200
    elif user:
        return jsonify({'error': True, 'message': 'wrong_password'}), 400
    else:
        return jsonify({'error': True, 'message': 'unregistered_email'}), 400

def get_user_auth():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            return jsonify({'data': payload}), 200
        except jwt.ExpiredSignatureError:
            return jsonify({'error': True, 'message': 'Token已過期'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': True, 'message': '無效的Token'}), 401
    else:
        return jsonify({'data': None}), 200
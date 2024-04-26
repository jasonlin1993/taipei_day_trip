# api/user_auth_api.py
from flask import Blueprint, request, jsonify
from model.user_auth_model import authenticate_user, validate_token

user_auth_api = Blueprint('user_auth_api', __name__)

@user_auth_api.route("/api/user/auth", methods=["GET", "PUT"])
def user_auth():
    if request.method == 'PUT':
        return put_user_auth()
    elif request.method == 'GET':
        return get_user_auth()

def put_user_auth():
    email = request.json.get('email')
    password = request.json.get('password')
    success, result = authenticate_user(email, password)
    if success:
        return jsonify({'token': result}), 200
    else:
        return jsonify({'error': True, 'message': result}), 400

def get_user_auth():
    auth_header = request.headers.get('Authorization')
    if auth_header:
        token = auth_header.split(' ')[1]
        success, result = validate_token(token)
        if success:
            return jsonify({'data': result}), 200
        else:
            return jsonify({'error': True, 'message': result}), 401
    else:
        return jsonify({'data': None}), 200

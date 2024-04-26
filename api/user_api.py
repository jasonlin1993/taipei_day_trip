# api/user_api.py
from flask import Blueprint, request, jsonify
from model.user_model import register_user

user_api = Blueprint('user_api', __name__)

@user_api.route("/api/user", methods=["POST"])
def post_user():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']

    try:
        success, message = register_user(name, email, password)
        if not success:
            return jsonify(error=True, message=message), 400
        return jsonify(ok=True), 200
    except Exception as e:
        print(e)
        return jsonify(error=True, message="伺服器內部錯誤"), 500

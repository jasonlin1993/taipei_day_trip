from flask import Blueprint, request, jsonify
from model.user_model import check_user_email, insert_user

user_api = Blueprint('user_api', __name__)

@user_api.route("/api/user", methods=["POST"])
def post_user():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password']

    try:
        result = check_user_email(email)
        if result['count'] > 0:
            return jsonify(error=True, message="註冊失敗，email 已經重複註冊"), 400

        insert_user(name, email, password)
        return jsonify(ok=True), 200

    except Exception as e:
        print(e)
        return jsonify(error=True, message="伺服器內部錯誤"), 500

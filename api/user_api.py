from flask import Blueprint
from flask import request
from flask import jsonify
from data.database import pool

user_api = Blueprint('user_api', __name__)

@user_api.route("/api/user", methods=["POST"])
def post_user():
    data = request.get_json()
    name = data['name']
    email = data['email']
    password = data['password'] 

    try:
        with pool.get_connection() as database:
            with database.cursor(dictionary=True) as cursor:
                sql_check = "SELECT COUNT(*) AS count FROM member WHERE email = %s"
                cursor.execute(sql_check, (email,))
                result = cursor.fetchone()

                if result['count'] > 0:
                    return jsonify(error=True, message="註冊失敗，email 已經重複註冊"), 400
                
                sql_insert = "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
                cursor.execute(sql_insert, (name, email, password))
                database.commit()

            return jsonify(ok=True), 200

    except Exception as e:
        print(e)
        return jsonify(error=True, message="伺服器內部錯誤"), 500

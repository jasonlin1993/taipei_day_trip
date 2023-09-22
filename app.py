from flask import *
from api.attractions_api import attractions_api
from api.attraction_id_api import attraction_id_api
from api.mrt_api import mrt_api
# from api.user_api import user_api
# from api.user_auth_api import user_auth_api
from data.database import pool
import jwt
import datetime

app = Flask(
    __name__,
    static_folder='static',
    static_url_path='/'
)


app.json.ensure_ascii = False
app.config["TEMPLATES_AUTO_RELOAD"]=True
SECRET_KEY = 'this_is_my_secret_key'

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")


@app.route("/api/user", methods=["GET"])
def postUser():
    # if request.method == 'GET':
    #     return jsonify(ok=True), 200
    # elif request.method == 'POST':  # 表單送出後會到這裡
        # data = request.get_json()
        # name = data['name']
        # email = data['email']
        # password = data['password']  # 在實際情境中，應該加密這個密碼

        # try:
        #     with pool.get_connection() as database:
        #         with database.cursor(dictionary=True) as cursor:
        #             # 檢查 email 是否存在
        #             sql_check = "SELECT COUNT(*) AS count FROM member WHERE email = %s"
        #             cursor.execute(sql_check, (email,))
        #             result = cursor.fetchone()

        #             if result['count'] > 0:
        #                 return jsonify(error=True, message="註冊失敗，email 已經重複註冊"), 400
                    
        #             # 插入新的用戶
        #             sql_insert = "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
        #             cursor.execute(sql_insert, (name, email, password))
        #             database.commit()

        #         return jsonify(ok=True), 200

        # except Exception as e:
        #     print(e)
            return jsonify(error=True, message="伺服器內部錯誤"), 500
        

@app.route("/api/user/auth", methods=["GET", "PUT"])
def user_auth():
    if request.method == 'PUT':
        return put_user_auth()
    elif request.method == 'GET':
        return get_user_auth()

def put_user_auth():
    return jsonify({'data': 'ok'}), 200
    # email = request.json.get('email')
    # password = request.json.get('password')
    
    # connection = pool.get_connection()
    # cursor = connection.cursor(dictionary=True)
    
    # cursor.execute("SELECT * FROM member WHERE email = %s", (email,))
    # user = cursor.fetchone()
    
    # cursor.close()
    # connection.close()
    
    # if user and user['password'] == password:  # 使用明文密碼進行比較
    #     payload = {
    #         'id': user['id'],
    #         'name': user['name'],
    #         'email': user['email'],
    #         'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    #     }
    #     token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    #     return jsonify({'token': token}), 200
    # elif user:
    #     return jsonify({'error': True, 'message': 'wrong_password'}), 400
    # else:
    #     return jsonify({'error': True, 'message': 'unregistered_email'}), 400

def get_user_auth():
    # auth_header = request.headers.get('Authorization')
    # if auth_header:
    #     token = auth_header.split(' ')[1]
    #     try:
    #         payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    #         return jsonify({'data': payload}), 200
    #     except jwt.ExpiredSignatureError:
    #         return jsonify({'error': True, 'message': 'Token已過期'}), 401
    #     except jwt.InvalidTokenError:
    #         return jsonify({'error': True, 'message': '無效的Token'}), 401
    # else:
        return jsonify({'data': None}), 200


app.register_blueprint(attractions_api)
app.register_blueprint(attraction_id_api)
app.register_blueprint(mrt_api)
# app.register_blueprint(user_api)
# app.register_blueprint(user_auth_api)
app.run(host="0.0.0.0", port=3000, debug=1)
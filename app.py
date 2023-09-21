from flask import *
from api.attractions_api import attractions_api
from api.attraction_id_api import attraction_id_api
from api.mrt_api import mrt_api
# from api.user_api import user_api
from api.user_auth_api import user_auth_api
from data.database import pool

app = Flask(
    __name__,
    static_folder='static',
    static_url_path='/'
)


app.json.ensure_ascii = False
app.config["TEMPLATES_AUTO_RELOAD"]=True


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


@app.route("/api/user", methods=["POST"])
def postUser():
    # if request.method == 'GET':
    #     return jsonify(ok=True), 200
    # elif request.method == 'POST':  # 表單送出後會到這裡
        data = request.get_json()
        name = data['name']
        email = data['email']
        password = data['password']  # 在實際情境中，應該加密這個密碼

        try:
            with pool.get_connection() as database:
                with database.cursor(dictionary=True) as cursor:
                    # 檢查 email 是否存在
                    sql_check = "SELECT COUNT(*) AS count FROM member WHERE email = %s"
                    cursor.execute(sql_check, (email,))
                    result = cursor.fetchone()

                    if result['count'] > 0:
                        return jsonify(error=True, message="註冊失敗，email 已經重複註冊"), 400
                    
                    # 插入新的用戶
                    sql_insert = "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
                    cursor.execute(sql_insert, (name, email, password))
                    database.commit()

                return jsonify(ok=True), 200

        except Exception as e:
            print(e)
            return jsonify(error=True, message="伺服器內部錯誤"), 500


app.register_blueprint(attractions_api)
app.register_blueprint(attraction_id_api)
app.register_blueprint(mrt_api)
# app.register_blueprint(user_api)
app.register_blueprint(user_auth_api)
app.run(host="0.0.0.0", port=3000, debug=1)
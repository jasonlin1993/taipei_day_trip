import os
import math
from flask import *
from dotenv import load_dotenv
from mysql.connector import pooling

app=Flask(__name__)
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True

load_dotenv()
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')


# 連線到資料庫
pool = pooling.MySQLConnectionPool(
	pool_name='mypool',
	pool_size=10,
    user=DB_USER,
    password=DB_PASSWORD,
    host='localhost',
    database='taipeitrip'
)


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

from flask import Response, request

def json_response(data, status=200):
    json_data = json.dumps(data, ensure_ascii=False, indent=2)
    return Response(json_data, status=status, content_type='application/json; charset=utf-8')

@app.route("/api/attractions", methods=["GET"])
def api_attractions():
    try:
        page = request.args.get('page', type=int, default=None)
        keyword = request.args.get('keyword')
        
        if page is None:
            return json_response({"error": True, "message": "Internal Server Error 500"}, 500)

        offset = page * 12
        
        with pool.get_connection() as database:
            with database.cursor(dictionary=True) as cursor:
                
                if keyword:
                    cursor.execute("SELECT COUNT(*) FROM attraction WHERE mrt = %s OR name LIKE %s", (keyword, f"%{keyword}%"))
                else:
                    cursor.execute("SELECT COUNT(*) FROM attraction")
                
                total = cursor.fetchone()['COUNT(*)']
                total_pages = int(total / 12)
                nextPage = page + 1 if page < total_pages else None
                
                if keyword:
                    cursor.execute("SELECT * FROM attraction WHERE mrt = %s OR name LIKE %s LIMIT %s, %s", (keyword, f"%{keyword}%", offset, 12))
                else:
                    cursor.execute("SELECT * FROM attraction LIMIT %s, %s", (offset, 12))
                attractions = cursor.fetchall()

        if attractions:
            data_list = []
            for attraction in attractions:
                with pool.get_connection() as database:
                    with database.cursor(dictionary=True) as cursor:
                        cursor.execute("SELECT images_link FROM images WHERE attraction_id = %s", (attraction["id"],))
                        images = cursor.fetchall()
                        images_links = [img["images_link"] for img in images]
                
                data_list.append({
                    "id": attraction["id"],
                    "name": attraction["name"],
                    "category": attraction["category"],
                    "description": attraction["description"],
                    "address": attraction["address"],
                    "transport": attraction["transport"],
                    "mrt": attraction["mrt"],
                    "lat": attraction["lat"],
                    "lng": attraction["lng"],
                    "images": images_links
                })

            data = {
                "nextPage": nextPage,
                "data": data_list
            }
            return json_response(data)

        else:
            return json_response({"error": True, "message": "無法取得資料"}, 500)

    except Exception as e:
        return json_response({"error": True, "message": "伺服器內部錯誤"}, 500)


        
@app.route("/api/attraction/<int:id>", methods=["GET"])
def getAttraction(id:int):
    try:
        with pool.get_connection() as database:
            with database.cursor(dictionary=True) as cursor:
                cursor.execute("SELECT * FROM attraction WHERE id = %s", (id,))
                attraction = cursor.fetchone()

                if attraction:
                    cursor.execute("SELECT images_link FROM images WHERE attraction_id = %s", (attraction["id"],))
                    images = cursor.fetchall()
                    images_links = [img["images_link"] for img in images]
                    data = {
                        "address": attraction["address"],
                        "category": attraction["category"],
                        "description": attraction["description"],
                        "id": attraction["id"],
                        "images": images_links,
                        "lat": attraction["lat"],
                        "lng": attraction["lng"],
                        "mrt": attraction["mrt"],
                        "name": attraction["name"],
                        "transport": attraction["transport"]
                    }
                    response_data = {
                        "data": data
                    }
                    return json_response(response_data)
                
                else:
                    return json_response({"error": True, "message": "景點編號不正確"}), 400

    except Exception as e:
        return json_response({"error": True, "message": "伺服器內部錯誤"}), 500

@app.route("/api/mrts", methods=["GET"])
def getMrt():
    try:
        with pool.get_connection() as database:
            with database.cursor(dictionary=True) as cursor:
                cursor.execute("SELECT mrt, COUNT(mrt) AS count FROM attraction GROUP BY mrt ORDER BY count DESC")
                results = cursor.fetchall()
                mrts = [item['mrt'] for item in results]
                return json_response({"data": mrts})
    except Exception as e:
        print(e)
        return json_response({"error": True, "message": "伺服器內部錯誤"}, status=500)


app.run(host="0.0.0.0", port=3000)
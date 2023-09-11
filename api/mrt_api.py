from flask import Blueprint
from flask import request
from flask import jsonify
from data.database import pool

mrt_api = Blueprint('mrt_api', __name__)

@mrt_api.route("/api/mrts", methods=["GET"])
def getMrt():
    try:
        with pool.get_connection() as database:
            with database.cursor(dictionary=True) as cursor:
                cursor.execute("SELECT mrt, COUNT(mrt) AS count FROM attraction GROUP BY mrt ORDER BY count DESC")
                results = cursor.fetchall()
                mrts = [item['mrt'] for item in results]
                return jsonify({"data": mrts})
    except Exception as e:
        print(e)
        return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500
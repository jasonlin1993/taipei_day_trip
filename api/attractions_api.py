from flask import Blueprint
from flask import request
from flask import jsonify
from data.database import pool

attractions_api = Blueprint('attractions_api', __name__)

@attractions_api.route("/api/attractions", methods=["GET"])
def api_attractions():
    try:
        page = request.args.get('page', type=int, default=None)
        keyword = request.args.get('keyword')
        
        if page is None:
            return jsonify({"error": True, "message": "Internal Server Error 500"}), 500

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
                    cursor.execute("""
                        SELECT attraction.*, GROUP_CONCAT(images.images_link) AS images_links 
                        FROM attraction 
                        LEFT JOIN images ON attraction.id = images.attraction_id 
                        WHERE mrt = %s OR name LIKE %s 
                        GROUP BY attraction.id 
                        LIMIT %s, %s
                    """, (keyword, f"%{keyword}%", offset, 12))
                else:
                    cursor.execute("""
                        SELECT attraction.*, GROUP_CONCAT(images.images_link) AS images_links 
                        FROM attraction 
                        LEFT JOIN images ON attraction.id = images.attraction_id 
                        GROUP BY attraction.id 
                        LIMIT %s, %s
                    """, (offset, 12))
                
                attractions = cursor.fetchall()

        if attractions:
            data_list = []
            for attraction in attractions:
                images_links = attraction["images_links"].split(",") if attraction["images_links"] else []

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
            return jsonify(data)

        else:
            return jsonify({"error": True, "message": "無法取得資料"}), 500

    except Exception as e:
        return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500
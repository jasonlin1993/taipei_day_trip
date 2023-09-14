from flask import Blueprint
from flask import request
from flask import jsonify
from data.database import pool

attraction_id_api = Blueprint('attractions_id_api', __name__)
@attraction_id_api.route("/api/attraction/<int:id>", methods=["GET"])
def getAttraction(id:int):
    try:
        with pool.get_connection() as database:
            with database.cursor(dictionary=True) as cursor:

                query = """
                        SELECT 
                            attraction.*, 
                            GROUP_CONCAT(images.images_link) AS images_links
                        FROM 
                            attraction 
                        LEFT JOIN 
                            images ON attraction.id = images.attraction_id 
                        WHERE 
                            attraction.id = %s
                        """

                cursor.execute(query, (id,))
                attraction = cursor.fetchone()

                if attraction and attraction["id"]:
                    images_links = attraction["images_links"].split(",") if attraction["images_links"] else []
                    
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
                    return jsonify(response_data)
                
                else:
                    return jsonify({"error": True, "message": "景點編號不正確"}), 400

    except Exception as e:
        return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500

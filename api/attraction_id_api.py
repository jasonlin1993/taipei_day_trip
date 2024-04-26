from flask import Blueprint,request,jsonify
from model.attraction_id_model import get_attraction_by_id

attraction_id_api = Blueprint('attractions_id_api', __name__)

@attraction_id_api.route("/api/attraction/<int:id>", methods=["GET"])
def get_attraction(id:int):
    try:
        attraction = get_attraction_by_id(id)

        if attraction and attraction["id"]:
            images_links = attraction["images_links"].split(",") if attraction ["images_links"] else []

            data = {
                "address":attraction["address"],
                "category":attraction["category"],
                "description":attraction["description"],
                "id":attraction["id"],
                "images":images_links,
                "lat":attraction["lat"],
                "lng":attraction["lng"],
                "mrt":attraction["mrt"],
                "name":attraction["name"],
                "transport":attraction["transport"]
            }

            response_data = {
                "data":data
            }
            return jsonify(response_data)
        else: 
            return jsonify({"error":True,"message":"景點編號不正確"}),400

    except Exception as e:
        return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500

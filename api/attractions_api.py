from flask import Blueprint, request, jsonify
from model.attractions_model import fetch_attractions

attractions_api = Blueprint('attractions_api', __name__)

@attractions_api.route("/api/attractions", methods=["GET"])
def api_attractions():
    try:
        page = request.args.get('page', type=int, default=None)
        keyword = request.args.get('keyword')
        
        if page is None:
            return jsonify({"error": True, "message": "Internal Server Error 500"}), 500

        nextPage, attractions = fetch_attractions(page, keyword)

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

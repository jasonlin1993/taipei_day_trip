from flask import Blueprint, jsonify
from .jwt_token import verify_jwt_token
from model.order_id_model import get_order_details

order_id_api = Blueprint('order_id_api', __name__)

@order_id_api.route("/api/order/<string:orderNumber>", methods=["GET"])
def get_order_by_number(orderNumber):
    payload, error_response, status_code = verify_jwt_token()
    if error_response:
        return error_response, status_code

    try:
        order_data, attraction_data, image_data = get_order_details(orderNumber)

        if not order_data:
            return jsonify({"data": None}), 200

        response_data = {
            "data": {
                "number": order_data["order_number"],
                "price": order_data["price"],
                "trip": {
                    "attraction": {
                        "id": attraction_data["id"],
                        "name": attraction_data["name"],
                        "address": attraction_data["address"],
                        "image": image_data["images_link"] if image_data else None
                    },
                    "date": order_data["date"],
                    "time": order_data["time"]
                },
                "contact": {
                    "name": order_data["memberName"],
                    "email": order_data["memberEmail"],
                    "phone": order_data["memberPhone"]
                },
                "status": order_data["status"]
            }
        }
        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"error": True, "message": "伺服器錯誤: " + str(e)}), 500

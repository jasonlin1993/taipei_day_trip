from flask import Blueprint
from flask import request
from flask import jsonify
from data.database import pool
from .jwt_token import verify_jwt_token

order_id_api = Blueprint('order_id_api', __name__)

@order_id_api.route("/api/order/<string:orderNumber>", methods=["GET"])
def get_order_by_number(orderNumber):
    payload, error_response, status_code = verify_jwt_token()
    if error_response:
        return error_response, status_code

    try:
        with pool.get_connection() as database:
            with database.cursor(dictionary=True) as cursor:
                cursor.execute("SELECT * FROM payment WHERE order_number=%s", (orderNumber,))
                order_data = cursor.fetchone()
                
                if not order_data:
                    return jsonify({"data": None}), 200
                
                cursor.execute("SELECT * FROM attraction WHERE id=%s", (order_data["attraction_id"],))
                attraction_data = cursor.fetchone()
                
                cursor.execute("SELECT * FROM images WHERE attraction_id=%s LIMIT 1", (order_data["attraction_id"],))
                image_data = cursor.fetchone()

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

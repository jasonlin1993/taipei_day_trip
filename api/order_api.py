from flask import Blueprint, request, jsonify
import requests
import jwt
import random
import datetime
from data.database import pool
import os
from dotenv import load_dotenv

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
x_api_key = os.getenv('x_api_key')

def verify_jwt_token():
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, jsonify({'error': True, 'message': '未登入系統，拒絕存取'}), 403

    token = auth_header.split(' ')[1]
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload, None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify({'error': True, 'message': 'Token已過期'}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({'error': True, 'message': '無效的Token'}), 401

order_api = Blueprint('order_api', __name__)
@order_api.route("/api/order", methods=["POST"])
def post_order():
    payload, error_response, status_code = verify_jwt_token()
    if error_response:
        return error_response, status_code

    request_data = request.json
    prime = request_data["prime"]
    attractionId = request_data["order"]["trip"]["attraction"]["id"]
    price = request_data["order"]["price"]
    date = request_data["order"]["trip"]["date"]
    time = request_data["order"]["trip"]["time"] 
    name = request_data["order"]["contact"]["name"] 
    email = request_data["order"]["contact"]["email"] 
    phone = request_data["order"]["contact"]["phone"] 
    user_id = payload['id']

    try:
        with pool.get_connection() as database:
            with database.cursor(dictionary=True) as cursor:
                order_number = f"{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}-{random.randint(100, 999)}"
                order_insert = (
                    "INSERT INTO payment(member_id, attraction_id, status, price, date, time, memberName, memberEmail, memberPhone, order_number)"
                    "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
                )
                cursor.execute(order_insert, (user_id, attractionId, 0, price, date, time, name, email, phone, order_number))
                database.commit()

                    
                # Send payment request to TapPay
                url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                headers = {
                    'Content-Type': 'application/json',
                    'x-api-key': x_api_key
                }
                price = int(price)
                data = {
                        "prime":prime,
                        "partner_key":x_api_key,
                        "merchant_id":"JasonLin_CTBC",
                        "details":"臺北一日遊",
                        "amount":price,
                        "order_number":order_number,
                        "cardholder":{
                            "phone_number":phone,
                            "name":name,
                            "email":email
                        },
                        "remember": True
                    }
                response = requests.post(url, headers=headers, json=data)
                tap_pay_response = response.json()
                print("TapPay Response:", tap_pay_response)
                # Update the order status based on TapPay response
                if tap_pay_response["status"] == 0:
                    cursor.execute("DELETE FROM booking WHERE member_id = %s", (user_id,))
                    database.commit()
                                
                    response = {
                        "data": {
                            "number": order_number,
                            "payment": {
                                "status": 0,
                                "message": "付款成功"
                            }
                        }
                    }
                    print(response)
                    return jsonify(response), 200

                else:
                    error_response = {
                        "error": True,
                        "message": tap_pay_response["msg"]
                    }
                    return jsonify(error_response), 400
                
    except Exception as e:
        return jsonify({"error": True, "message": "伺服器錯誤: " + str(e)}), 500
    


@order_api.route("/api/order/<string:orderNumber>", methods=["GET"])
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

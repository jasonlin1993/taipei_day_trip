from flask import Blueprint
from flask import request
from flask import jsonify
import requests
import random
import datetime
import os
from dotenv import load_dotenv
from data.database import pool
from .jwt_token import verify_jwt_token

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
x_api_key = os.getenv('x_api_key')



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
    

from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv
from .jwt_token import verify_jwt_token
from model.order_model import create_order, update_payment_status

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
    attraction_id = request_data["order"]["trip"]["attraction"]["id"]
    price = request_data["order"]["price"]
    date = request_data["order"]["trip"]["date"]
    time = request_data["order"]["trip"]["time"]
    name = request_data["order"]["contact"]["name"]
    email = request_data["order"]["contact"]["email"]
    phone = request_data["order"]["contact"]["phone"]
    user_id = payload['id']

    order_number = create_order(user_id, attraction_id, price, date, time, name, email, phone)

    # Send payment request to TapPay
    url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
    headers = {'Content-Type': 'application/json', 'x-api-key': x_api_key}
    data = {
        "prime": prime,
        "partner_key": x_api_key,
        "merchant_id": "JasonLin_CTBC",
        "details": "臺北一日遊",
        "amount": int(price),
        "order_number": order_number,
        "cardholder": {"phone_number": phone, "name": name, "email": email},
        "remember": True
    }
    response = requests.post(url, headers=headers, json=data)
    tap_pay_response = response.json()

    if tap_pay_response["status"] == 0:
        update_payment_status(user_id)
        return jsonify({"data": {"number": order_number, "payment": {"status": 0, "message": "付款成功"}}}), 200
    else:
        return jsonify({"error": True, "message": tap_pay_response["msg"]}), 400

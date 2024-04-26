import os
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from .jwt_token import verify_jwt_token
from model.booking_model import fetch_booking, insert_or_update_booking, delete_booking

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

booking_api = Blueprint('booking_api', __name__)

@booking_api.route("/api/booking", methods=["GET", "POST", "DELETE"])        
def api_booking():
    if request.method == "GET":
        return get_booking()
    elif request.method == "POST":
        return post_booking()
    elif request.method == "DELETE":
        return delete_booking()

def get_booking():
    payload, error_response, status_code = verify_jwt_token()
    if error_response:
        return error_response, status_code

    user_id = payload['id']
    booking_data, attraction_data, image_data = fetch_booking(user_id)

    if not booking_data:
        return jsonify({'data': None}), 200

    response_data = {
        "data": {
            "attraction": {
                "id": attraction_data['id'],
                "name": attraction_data['name'],
                "address": attraction_data['address'],
                "image": image_data['images_link'] if image_data else None
            },
            "date": booking_data['date'].strftime('%Y-%m-%d'), 
            "time": booking_data['time'],
            "price": int(booking_data['price']) 
        }
    }
    return jsonify(response_data), 200

def post_booking():
    payload, error_response, status_code = verify_jwt_token()
    if error_response:
        return error_response, status_code
    
    data = request.json
    required_fields = ['attraction_id', 'date', 'time', 'price']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': True, 'message': '建立失敗，輸入不正確或其他原因'}), 400

    user_id = payload['id']
    attraction_id = data['attraction_id']
    date = data['date']
    time = data['time']
    price = data['price']

    insert_or_update_booking(user_id, attraction_id, date, time, price)

    return jsonify({'ok': True}), 200

def delete_booking():
    payload, error_response, status_code = verify_jwt_token()
    if error_response:
        return error_response, status_code
    
    user_id = payload['id']
    delete_booking(user_id)
    return jsonify({'ok': True}), 200

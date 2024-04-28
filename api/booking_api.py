import os
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from .jwt_token import verify_jwt_token
from model.booking_model import get_booking, post_booking, delete_booking

load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')

booking_api = Blueprint('booking_api', __name__)

@booking_api.route("/api/booking", methods=["GET", "POST", "DELETE"])        
def api_booking():
    payload, error_response, status_code = verify_jwt_token()
    if error_response:
        return error_response, status_code

    if request.method == "GET":
        user_id = payload['id']
        return get_booking(user_id)
    elif request.method == "POST":
        user_id = payload['id']
        return post_booking(user_id, request.json)
    elif request.method == "DELETE":
        user_id = payload['id']
        return delete_booking(user_id)

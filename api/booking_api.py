from flask import Blueprint
from flask import request
from flask import jsonify
from data.database import pool

booking_api = Blueprint('booking_api', __name__)

@booking_api.route("/api/booking", methods=["GET", "POST", "DELETE"])
def api_booking():
    pass
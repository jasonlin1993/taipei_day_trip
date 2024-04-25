import os
from flask import Blueprint
from flask import request
from flask import jsonify
from data.database import pool
from dotenv import load_dotenv
from .jwt_token import verify_jwt_token

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
    connection = pool.get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM booking WHERE member_id = %s LIMIT 1", (user_id,))
    booking_data = cursor.fetchone()

    if not booking_data:
        return jsonify({'data': None}), 200


    cursor.execute("SELECT id, name, address FROM attraction WHERE id = %s", (booking_data['attraction_id'],))
    attraction_data = cursor.fetchone()


    cursor.execute("SELECT images_link FROM images WHERE attraction_id = %s LIMIT 1", (attraction_data['id'],))
    image_data = cursor.fetchone()

    cursor.close()
    connection.close()

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

    connection = pool.get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "SELECT COUNT(*) FROM booking WHERE member_id=%s",
        (user_id,)
    )
    existing_booking_count = cursor.fetchone()[0]

    try:
        if existing_booking_count > 0:
            cursor.execute(
                "UPDATE booking SET attraction_id=%s, date=%s, time=%s, price=%s WHERE member_id=%s",
                (attraction_id, date, time, price, user_id)
            )
        else:
            cursor.execute(
                "INSERT INTO booking (member_id, attraction_id, date, time, price) VALUES (%s, %s, %s, %s, %s)",
                (user_id, attraction_id, date, time, price)
            )
        connection.commit()

    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({'error': True, 'message': '伺服器內部錯誤: {}'.format(str(e))}), 500

    cursor.close()
    connection.close()
    return jsonify({'ok': True}), 200

def delete_booking():
    payload, error_response, status_code = verify_jwt_token()
    if error_response:
        return error_response, status_code
    user_id = payload['id']
    connection = pool.get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("DELETE FROM booking WHERE member_id = %s", (user_id,))
        connection.commit()

    except Exception as e:
        cursor.close()
        connection.close()
        return jsonify({'error': True, 'message': '伺服器內部錯誤: {}'.format(str(e))}), 500

    cursor.close()
    connection.close()
    return jsonify({'ok': True}), 200

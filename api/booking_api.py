from flask import Blueprint
from flask import request
from flask import jsonify
import jwt
from data.database import pool
SECRET_KEY = 'this_is_my_secret_key'

booking_api = Blueprint('booking_api', __name__)

@booking_api.route("/api/booking", methods=["GET", "POST", "DELETE"])

def api_booking():
    if request.method == "GET":
        return get_booking()
    elif request.method == "POST":
        return post_booking()
    elif request.method == "DELETE":
        return delete_booking()
    
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

def get_booking():
    # 1. 檢查使用者是否已登入（是否有有效的 JWT Token）
    payload, error_response, status_code = verify_jwt_token()
    if error_response:
        return error_response, status_code

    # 2. 從 `booking` 資料表中獲取使用者的預定行程
    user_id = payload['id']
    connection = pool.get_connection()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT * FROM booking WHERE member_id = %s LIMIT 1", (user_id,))
    booking_data = cursor.fetchone()

    if not booking_data:
        return jsonify({'data': None}), 200

    # 3. 獲取景點資料
    cursor.execute("SELECT * FROM attraction WHERE id = %s", (booking_data['attraction_id'],))
    attraction_data = cursor.fetchone()

    # 4. 獲取景點的圖片
    cursor.execute("SELECT * FROM images WHERE attraction_id = %s LIMIT 1", (attraction_data['id'],))
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
            "date": booking_data['date'].strftime('%Y-%m-%d'),  # 將日期格式化
            "time": booking_data['time'],
            "price": booking_data['price']
        }
    }
    return jsonify(response_data), 200

def post_booking():
    # 1. 檢查使用者是否已登入（是否有有效的 JWT Token）
    payload, error_response, status_code = verify_jwt_token()
    if error_response:
        return error_response, status_code
    
    # 2. 獲取請求數據並檢查是否齊全
    data = request.json
    required_fields = ['attraction_id', 'date', 'time', 'price']
    
    if not all(field in data for field in required_fields):
        return jsonify({'error': True, 'message': '建立失敗，輸入不正確或其他原因'}), 400

    # 3. 將新的預定行程存到 `booking` 資料表中
    user_id = payload['id']
    attraction_id = data['attraction_id']
    date = data['date']
    time = data['time']
    price = data['price']

    connection = pool.get_connection()
    cursor = connection.cursor()

    try:
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
    # 1. 檢查使用者是否已登入（是否有有效的 JWT Token）
    payload, error_response, status_code = verify_jwt_token()
    if error_response:
        return error_response, status_code
    
    # 2. 從 `booking` 資料表中刪除使用者的預定行程
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

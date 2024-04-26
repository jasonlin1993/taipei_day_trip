import datetime
import random
from data.database import pool

def create_order(user_id, attraction_id, price, date, time, name, email, phone):
    order_number = f"{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}-{random.randint(100, 999)}"
    with pool.get_connection() as database:
        with database.cursor() as cursor:
            order_insert = (
                "INSERT INTO payment(member_id, attraction_id, status, price, date, time, memberName, memberEmail, memberPhone, order_number)"
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            )
            cursor.execute(order_insert, (user_id, attraction_id, 0, price, date, time, name, email, phone, order_number))
            database.commit()
    return order_number

def update_payment_status(user_id):
    with pool.get_connection() as database:
        with database.cursor() as cursor:
            cursor.execute("DELETE FROM booking WHERE member_id = %s", (user_id,))
            database.commit()

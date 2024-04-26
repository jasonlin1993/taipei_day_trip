from data.database import pool

def fetch_booking(user_id):
    with pool.get_connection() as connection:
        with connection.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM booking WHERE member_id = %s LIMIT 1", (user_id,))
            booking_data = cursor.fetchone()

            if booking_data:
                cursor.execute("SELECT id, name, address FROM attraction WHERE id = %s", (booking_data['attraction_id'],))
                attraction_data = cursor.fetchone()

                cursor.execute("SELECT images_link FROM images WHERE attraction_id = %s LIMIT 1", (attraction_data['id'],))
                image_data = cursor.fetchone()

            return booking_data, attraction_data, image_data

def insert_or_update_booking(user_id, attraction_id, date, time, price):
    with pool.get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM booking WHERE member_id=%s", (user_id,))
            existing_booking_count = cursor.fetchone()[0]

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

def delete_booking(user_id):
    with pool.get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM booking WHERE member_id = %s", (user_id,))
            connection.commit()

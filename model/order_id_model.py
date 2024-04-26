from data.database import pool

def get_order_details(order_number):
    with pool.get_connection() as database:
        with database.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT * FROM payment WHERE order_number=%s", (order_number,))
            order_data = cursor.fetchone()

            if not order_data:
                return None, None, None

            cursor.execute("SELECT * FROM attraction WHERE id=%s", (order_data["attraction_id"],))
            attraction_data = cursor.fetchone()

            cursor.execute("SELECT * FROM images WHERE attraction_id=%s LIMIT 1", (order_data["attraction_id"],))
            image_data = cursor.fetchone()

            return order_data, attraction_data, image_data

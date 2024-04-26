from data.database import pool

def fetch_all_mrts():
    with pool.get_connection() as database:
        with database.cursor(dictionary=True) as cursor:
            cursor.execute("SELECT mrt, COUNT(mrt) AS count FROM attraction GROUP BY mrt ORDER BY count DESC")
            results = cursor.fetchall()
            mrts = [item['mrt'] for item in results]
            return mrts

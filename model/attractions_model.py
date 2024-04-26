from data.database import pool

def fetch_attractions(page, keyword):
    offset = page * 12
    with pool.get_connection() as database:
        with database.cursor(dictionary=True) as cursor:
            if keyword:
                cursor.execute("SELECT COUNT(*) FROM attraction WHERE mrt = %s OR name LIKE %s", (keyword, f"%{keyword}%"))
            else:
                cursor.execute("SELECT COUNT(*) FROM attraction")
            
            total = cursor.fetchone()['COUNT(*)']
            total_pages = int(total / 12)
            nextPage = page + 1 if page < total_pages else None
            
            if keyword:
                cursor.execute("""
                    SELECT attraction.*, GROUP_CONCAT(images.images_link) AS images_links 
                    FROM attraction 
                    LEFT JOIN images ON attraction.id = images.attraction_id 
                    WHERE mrt = %s OR name LIKE %s 
                    GROUP BY attraction.id 
                    LIMIT %s, %s
                """, (keyword, f"%{keyword}%", offset, 12))
            else:
                cursor.execute("""
                    SELECT attraction.*, GROUP_CONCAT(images.images_link) AS images_links 
                    FROM attraction 
                    LEFT JOIN images ON attraction.id = images.attraction_id 
                    GROUP BY attraction.id 
                    LIMIT %s, %s
                """, (offset, 12))
            
            attractions = cursor.fetchall()
            return nextPage, attractions

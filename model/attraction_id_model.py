from data.database import pool

def get_attraction_by_id(attraction_id):
    with pool.get_connection() as database:
        with database.cursor(dictionary=True) as cursor:
            query = """
                    SELECT 
                        attraction.*, 
                        GROUP_CONCAT(images.images_link) AS images_links
                    FROM 
                        attraction 
                    LEFT JOIN 
                        images ON attraction.id = images.attraction_id 
                    WHERE 
                        attraction.id = %s
                    """
            cursor.execute(query, (attraction_id,))
            attraction = cursor.fetchone()
            return attraction

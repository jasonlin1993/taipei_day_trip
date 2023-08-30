import os
import json
import mysql.connector
from dotenv import load_dotenv

load_dotenv()
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')


# 連線到資料庫
db = mysql.connector.connect(
    user=DB_USER,
    password=DB_PASSWORD,
    host='localhost',
    database='taipeitrip'
)
cursor = db.cursor()

with open('taipei-attractions.json', 'r', encoding='utf-8') as file:
    json_data = json.load(file)
    attractions = json_data["result"]["results"]
    for item in attractions:
        name = item["name"]
        category = item['CAT']
        description = item['description']
        address = item['address']
        transport = item['direction']
        mrt = item['MRT']
        lat = float(item['latitude'])
        lng = float(item['longitude'])  
        image_urls = item['file'].split('https://')
        valid_image_urls = [f"https://{url}" for url in image_urls if url.endswith(('.jpg', '.JPG', '.PNG', '.png'))]

        insert_attraction = """
        INSERT INTO attraction (name, category, description, address, transport, mrt, lat, lng)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """
        cursor.execute(insert_attraction, (name, category, description, address, transport, mrt, lat, lng))
        attraction_id = cursor.lastrowid 

        for url in valid_image_urls:
            insert_images = """
            INSERT INTO images (attraction_id, images_link)
            VALUES (%s, %s);
            """
            cursor.execute(insert_images, (attraction_id, url))
        
        db.commit()

cursor.close()
db.close()

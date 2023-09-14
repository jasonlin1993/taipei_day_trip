from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

# 連線到資料庫
pool = pooling.MySQLConnectionPool(
    pool_name='mypool',
    pool_size=10,
    user=DB_USER,
    password=DB_PASSWORD,
    host='localhost',
    database='taipeitrip',
    charset='utf8'
)

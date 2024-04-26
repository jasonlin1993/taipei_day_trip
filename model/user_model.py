from data.database import pool

def check_user_email(email):
    with pool.get_connection() as database:
        with database.cursor(dictionary=True) as cursor:
            sql_check = "SELECT COUNT(*) AS count FROM member WHERE email = %s"
            cursor.execute(sql_check, (email,))
            result = cursor.fetchone()
    return result

def insert_user(name, email, password):
    with pool.get_connection() as database:
        with database.cursor(dictionary=True) as cursor:
            sql_insert = "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
            cursor.execute(sql_insert, (name, email, password))
            database.commit()

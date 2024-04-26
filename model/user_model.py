from data.database import pool

def register_user(name, email, password):
    with pool.get_connection() as database:
        with database.cursor() as cursor:
            sql_check = "SELECT COUNT(*) AS count FROM member WHERE email = %s"
            cursor.execute(sql_check, (email,))
            result = cursor.fetchone()
            if result['count'] > 0:
                return False, "註冊失敗，email 已經重複註冊"

            sql_insert = "INSERT INTO member (name, email, password) VALUES (%s, %s, %s)"
            cursor.execute(sql_insert, (name, email, password))
            database.commit()
            return True, None

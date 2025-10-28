from flaskr.db import db
from flaskr.models import User
from werkzeug.security import generate_password_hash
import re
import random
import string

class RegisterService:
    @staticmethod
    def register(email, password, confirm):
        print("Received parameters:", email, password, confirm)

        if not email or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            print("Email format validation failed")
            return {"status": "error", "message": "Invalid email format"}

        if not password or len(password) < 6:
            print("Password length validation failed")
            return {"status": "error", "message": "Password must be at least 6 characters"}

        if password != confirm:
            print("Passwords do not match")
            return {"status": "error", "message": "Passwords do not match"}

        if User.query.filter_by(email=email).first():
            print("邮箱已注册")
            return {"status": "error", "message": "Email already registered"}

        print("所有校验通过，准备写入数据库")
        # 3. Password hash
        hashed_password = generate_password_hash(password)
        # 4. Save to database
        try:
            new_user = User(email=email, password=hashed_password, username=email)
            db.session.add(new_user)
            db.session.commit()
            return {"status": "ok", "message": "Registration successful"}
        except Exception as e:
            db.session.rollback()
            return {"status": "error", "message": f"Registration failed: {str(e)}"}

    @staticmethod
    def get_captcha(phone):
        # Generate a 6-digit captcha
        captcha = ''.join(random.choices(string.digits, k=6))
        # Here you should send the captcha to the user's phone
        return {
            "status": "ok",
            "message": "Captcha sent",
            "captcha": captcha  # For testing only
        } 
from datetime import datetime
from flaskr.models import User
from flaskr.db import db

class UserService:
    @staticmethod
    def create_user(username, email, password, is_admin=False):
        """Create a new user"""
        user = User(
            username=username,
            email=email,
            password=password,  # Note: Should hash password in production
            is_admin=is_admin
        )
        db.session.add(user)
        db.session.commit()
        return user

    @staticmethod
    def get_user_by_id(user_id):
        """Get user by ID"""
        return User.query.get(user_id)

    @staticmethod
    def get_user_by_email(email):
        """Get user by email"""
        return User.query.filter_by(email=email).first()

    @staticmethod
    def update_user(user_id, **kwargs):
        """Update user information"""
        user = User.query.get(user_id)
        if user:
            for key, value in kwargs.items():
                setattr(user, key, value)
            db.session.commit()
        return user

    @staticmethod
    def delete_user(user_id):
        """Delete a user"""
        user = User.query.get(user_id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return True
        return False 
    
    @staticmethod
    def count_users():
        return User.query.count()

    @staticmethod
    def count_active_users():
        return User.query.filter(User.last_login.isnot(None)).count()

    @staticmethod
    def count_admins():
        return User.query.filter_by(is_admin=True).count()

    @staticmethod
    def count_new_users_today():
        today = datetime.utcnow().date()
        return User.query.filter(db.func.date(User.created_at) == today).count()
    

    @staticmethod
    def update_user_role(user_id, new_status):
        user = User.query.get(user_id)
        if not user:
            return None
        user.is_admin = (new_status == 'admin')
        db.session.commit()
        return user


    @staticmethod
    def get_all_users():
        return User.query.all()

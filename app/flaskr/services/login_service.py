from flaskr.models import User
from werkzeug.security import check_password_hash

class LoginService:
    @staticmethod
    def login(username=None, password=None, mobile=None, captcha=None, type=None):
        # Account password login
        if type == 'account':
            if not username or not password:
                return {
                    "status": "error",
                    "currentAuthority": "guest",
                    "message": "Username and password are required."
                }
            user = User.query.filter((User.email == username) | (User.username == username)).first()
            if not user or not check_password_hash(user.password, password):
                return {
                    "status": "error",
                    "currentAuthority": "guest",
                    "message": "Incorrect username or password."
                }
            authority = "admin" if user.is_admin else "user"
            return {
                "status": "ok",
                "currentAuthority": authority,
                "token": "abc.def.ghi"
            }
        # Mobile verification code login
        elif type == 'mobile':
            if not mobile or not captcha:
                return {
                    "status": "error",
                    "currentAuthority": "guest",
                    "message": "Mobile and captcha are required."
                }
            if captcha != '1234':
                return {
                    "status": "error",
                    "currentAuthority": "guest",
                    "message": "Incorrect captcha."
                }
            user = User.query.filter_by(username=mobile).first() or User.query.filter_by(email=mobile).first()
            if not user:
                return {
                    "status": "error",
                    "currentAuthority": "guest",
                    "message": "Mobile not registered."
                }
            authority = "admin" if user.is_admin else "user"
            return {
                "status": "ok",
                "currentAuthority": authority,
                "token": "abc.def.ghi"
            }
        else:
            return {
                "status": "error",
                "currentAuthority": "guest",
                "message": "Invalid login type."
            } 
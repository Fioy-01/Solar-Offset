from flask import Blueprint, jsonify, request
from flaskr.services.login_service import LoginService

bp = Blueprint('login', __name__, url_prefix='/api')

@bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    data = request.get_json()
    login_type = data.get('type')
    if login_type == 'account':
        result = LoginService.login(
            username=data.get('username'),
            password=data.get('password'),
            type='account'
        )
    elif login_type == 'mobile':
        result = LoginService.login(
            mobile=data.get('mobile'),
            captcha=data.get('captcha'),
            type='mobile'
        )
    else:
        result = {
            "status": "error",
            "currentAuthority": "guest",
            "message": "Invalid login type."
        }
    return jsonify(result)

@bp.route('/getCaptcha', methods=['GET'])
def get_captcha():
    """Get verification code endpoint"""
    phone = request.args.get('phone')
    result = LoginService.get_captcha(phone)
    return jsonify(result)

@bp.route('/auth/google', methods=['GET'])
def google_login():
    """Google login endpoint"""
    return LoginService.initiate_google_login() 
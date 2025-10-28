from flask import Blueprint, jsonify, request
from flaskr.services.register_service import RegisterService

bp = Blueprint('register', __name__, url_prefix='/api')

@bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint (mobile field removed)"""
    data = request.get_json()
    result = RegisterService.register(
        email=data.get('email'),
        password=data.get('password'),
        confirm=data.get('confirm')
    )
    return jsonify(result)

@bp.route('/getCaptcha', methods=['GET'])
def get_captcha():
    """Get verification code endpoint"""
    phone = request.args.get('phone')
    result = RegisterService.get_captcha(phone)
    return jsonify(result) 
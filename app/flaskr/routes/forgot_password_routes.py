from flask import Blueprint, jsonify, request
from flaskr.services.forgot_password_service import ForgotPasswordService

bp = Blueprint('forgot_password', __name__, url_prefix='/api')

@bp.route('/getResetCode', methods=['POST'])
def get_reset_code():
    """Get password reset code endpoint"""
    data = request.get_json()
    result = ForgotPasswordService.get_reset_code(data.get('email'))
    return jsonify(result)

@bp.route('/resetPassword', methods=['POST'])
def reset_password():
    """Reset password endpoint"""
    data = request.get_json()
    result = ForgotPasswordService.reset_password(
        email=data.get('email'),
        code=data.get('code'),
        new_password=data.get('newPassword'),
        confirm_password=data.get('confirmPassword')
    )
    return jsonify(result) 
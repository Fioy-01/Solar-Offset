from flask import Blueprint, jsonify, request
from flaskr.services.user_service import UserService

bp = Blueprint('user', __name__, url_prefix='/api/users')


@bp.route('/', methods=['GET'])
def get_users():
    users = UserService.get_all_users()
    return jsonify([user.to_dict() for user in users])


@bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    user = UserService.create_user(**data)
    return jsonify({"message": "Created"}), 201

@bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = UserService.get_user_by_id(user_id)
    return jsonify(user.to_dict())

@bp.route('/info', methods=['GET'])
def get_user_info():
    user = UserService.get_user_by_id(1)
    if user:
        return jsonify(user.to_dict())
    else:
        return jsonify({"error": "User not found"}), 404

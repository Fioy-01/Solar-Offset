from flask import Blueprint, jsonify, request
from flaskr.services.user_service import UserService
from flaskr.services.admin_report_service import AdminReportService
from flaskr.models import User


# Blueprint for admin report-related routes
bp = Blueprint('admin_report', __name__, url_prefix='/api/admin')

@bp.route('/', methods=['POST'])
def create_report():
    """Create a new admin report"""
    data = request.get_json()
    report = AdminReportService.create_report(
        report_name=data['report_name'],
        generated_by=data['generated_by'],
        report_data=data['report_data']
    )
    return jsonify({"message": "Report created successfully"}), 201


@bp.route('/statistics', methods=['GET'])
def get_admin_statistics():
    
    total_users = UserService.count_users()
    active_users = UserService.count_active_users()
    admin_users = UserService.count_admins()
    new_users_today = UserService.count_new_users_today()

    return jsonify({
        "totalUsers": total_users,
        "activeUsers": active_users,
        "adminUsers": admin_users,
        "newUsersToday": new_users_today
    })


@bp.route('/users', methods=['GET'])
def get_users():
    # 获取分页参数
    page = int(request.args.get('current', 1))
    page_size = int(request.args.get('pageSize', 10))

    # 分页查询
    pagination = User.query.paginate(page=page, per_page=page_size, error_out=False)
    users = pagination.items

    data = [{
        "id": user.user_id,  # ← 你模型里是 user_id，不是 id
        "status": "admin" if user.is_admin else "user",
        "name": user.username,
        "registrationDate": user.created_at.strftime('%Y-%m-%d') if user.created_at else None,
        "lastLogin": user.last_login.strftime('%Y-%m-%d %H:%M:%S') if hasattr(user, 'last_login') and user.last_login else None
    } for user in users]

    return jsonify({
        "data": data,
        "total": pagination.total,
        "success": True
    })



@bp.route('/<int:report_id>', methods=['GET'])
def get_report(report_id):
    """Get a specific admin report"""
    report = AdminReportService.get_report_by_id(report_id)
    if report:
        return jsonify({
            'id': report.report_id,
            'name': report.report_name,
            'generated_by': report.generated_by,
            'data': report.report_data,
            'created_at': report.created_at.isoformat()
        }), 200
    return jsonify({"error": "Report not found"}), 404 

@bp.route('/user/status', methods=['PUT'])
def update_user_status():
    """更新用户状态（如封禁、变更 admin 权限）"""
    data = request.get_json()
    user_id = data.get("user_id")
    new_status = data.get("status")  # e.g., 'admin' or 'user'

    updated_user = UserService.update_user_role(user_id, new_status)
    if not updated_user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User status updated successfully"})


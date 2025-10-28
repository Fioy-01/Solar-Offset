from flask import Blueprint, jsonify, request
from flaskr.services.payment_service import PaymentService

# Blueprint for payment-related routes
bp = Blueprint('payment', __name__, url_prefix='/api/payments')

@bp.route('/', methods=['POST'])
def create_payment():
    """Create a new payment"""
    data = request.get_json()
    payment = PaymentService.create_payment(
        user_id=data['user_id'],
        contribution_id=data['contribution_id'],
        payment_method=data['payment_method'],
        amount=data['amount']
    )
    return jsonify({"message": "Payment created successfully"}), 201

@bp.route('/<int:payment_id>/status', methods=['PUT'])
def update_payment_status(payment_id):
    """Update payment status"""
    data = request.get_json()
    payment = PaymentService.update_payment_status(payment_id, data['status'])
    if payment:
        return jsonify({"message": "Payment status updated"}), 200
    return jsonify({"error": "Payment not found"}), 404

@bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_payments(user_id):
    """Get all payments for a specific user"""
    payments = PaymentService.get_user_payments(user_id)
    return jsonify([{
        'id': p.payment_id,
        'amount': p.amount,
        'status': p.payment_status.value,
        'method': p.payment_method.value,
        'created_at': p.created_at.isoformat()
    } for p in payments]), 200 

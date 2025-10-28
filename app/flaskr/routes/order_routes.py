from flask import Blueprint, jsonify, request
from flaskr.services.order_service import OrderService

bp = Blueprint('order', __name__, url_prefix='/api')

@bp.route('/cart/add', methods=['POST'])
def add_to_cart():
    """Add item to cart endpoint"""
    data = request.get_json()
    result = OrderService.add_to_cart(
        user_id=data.get('userId'),
        project_id=data.get('projectId'),
        quantity=data.get('quantity', 1)
    )
    return jsonify(result)

@bp.route('/order/confirm', methods=['POST'])
def confirm_order():
    """Confirm order endpoint"""
    data = request.get_json()
    result = OrderService.confirm_order(
        user_id=data.get('userId'),
        project_id=data.get('projectId'),
        amount=data.get('amount')
    )
    return jsonify(result)

@bp.route('/order/address', methods=['POST'])
def submit_address():
    """Submit address and contact information endpoint"""
    data = request.get_json()
    result = OrderService.submit_address(
        user_id=data.get('userId'),
        name=data.get('name'),
        phone=data.get('phone'),
        country=data.get('country'),
        city=data.get('city'),
        address=data.get('address'),
        postal_code=data.get('postalCode')
    )
    return jsonify(result)

@bp.route('/order/paypal-status', methods=['POST'])
def update_paypal_status():
    """Update order status after PayPal payment endpoint"""
    data = request.get_json()
    result = OrderService.update_payment_status(
        order_id=data.get('orderId'),
        payment_id=data.get('paymentId'),
        status=data.get('status')
    )
    return jsonify(result) 
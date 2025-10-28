from flaskr.models import Payment
from flaskr.db import db

class PaymentService:
    @staticmethod
    def create_payment(user_id, contribution_id, payment_method, amount):
        """Create a new payment"""
        payment = Payment(
            user_id=user_id,
            contribution_id=contribution_id,
            payment_method=payment_method,
            amount=amount
        )
        db.session.add(payment)
        db.session.commit()
        return payment

    @staticmethod
    def get_user_payments(user_id):
        """Get all payments by user ID"""
        return Payment.query.filter_by(user_id=user_id).all()

    @staticmethod
    def update_payment_status(payment_id, status):
        """Update payment status"""
        payment = Payment.query.get(payment_id)
        if payment:
            payment.payment_status = status
            db.session.commit()
        return payment 
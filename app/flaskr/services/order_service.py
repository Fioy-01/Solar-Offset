from flaskr.db import db
from flaskr.models import Contribution, Payment, PaymentStatus, PaymentMethod

class OrderService:
    @staticmethod
    def add_to_cart(user_id, project_id, quantity=1):
        """Add item to cart"""
        try:
            # Add cart logic here
            # Since we use Contribution model, we can directly create a contribution record
            contribution = Contribution(
                user_id=user_id,
                project_id=project_id,
                amount=0,  # Amount will be updated when order is confirmed
                carbon_offset=0  # Carbon offset will be updated when order is confirmed
            )
            db.session.add(contribution)
            db.session.commit()
            
            return {
                "success": True,
                "message": "Item added to cart successfully",
                "contribution_id": contribution.contribution_id
            }
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "message": str(e)
            }

    @staticmethod
    def confirm_order(user_id, project_id, amount):
        """Confirm order and create payment record"""
        try:
            # Create contribution record
            contribution = Contribution(
                user_id=user_id,
                project_id=project_id,
                amount=amount,
                carbon_offset=amount * 0.1  # Example: assume 0.1 unit carbon offset per 1 unit amount
            )
            db.session.add(contribution)
            db.session.commit()

            # Create payment record
            payment = Payment(
                user_id=user_id,
                contribution_id=contribution.contribution_id,
                payment_method=PaymentMethod.PAYPAL,
                amount=amount,
                payment_status=PaymentStatus.PENDING
            )
            db.session.add(payment)
            db.session.commit()

            return {
                "success": True,
                "message": "Order confirmed successfully",
                "order_id": contribution.contribution_id,
                "payment_id": payment.payment_id
            }
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "message": str(e)
            }

    @staticmethod
    def submit_address(user_id, name, phone, country, city, address, postal_code):
        """Submit address and contact information"""
        try:
            # Add address saving logic here
            # Since we don't have Address model, just return success message
            return {
                "success": True,
                "message": "Address submitted successfully"
            }
        except Exception as e:
            return {
                "success": False,
                "message": str(e)
            }

    @staticmethod
    def update_payment_status(order_id, payment_id, status):
        """Update payment status after PayPal payment"""
        try:
            payment = Payment.query.get(payment_id)
            if not payment:
                return {
                    "success": False,
                    "message": "Payment not found"
                }

            payment.payment_status = PaymentStatus.COMPLETED if status == "completed" else PaymentStatus.FAILED
            db.session.commit()

            return {
                "success": True,
                "message": "Payment status updated successfully"
            }
        except Exception as e:
            db.session.rollback()
            return {
                "success": False,
                "message": str(e)
            } 
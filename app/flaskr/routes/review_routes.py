from flask import Blueprint, jsonify, request
from flaskr.services.review_service import ReviewService

bp = Blueprint('review', __name__, url_prefix='/api')

@bp.route('/reviews', methods=['GET'])
def get_reviews():
    """Get reviews endpoint"""
    product = request.args.get('product', 'general')
    reviews = ReviewService.get_reviews(product)
    return jsonify(reviews)

@bp.route('/reviews', methods=['POST'])
def create_review():
    """Create review endpoint"""
    data = request.get_json()
    result = ReviewService.create_review(
        username=data.get('username'),
        rating=data.get('rating'),
        content=data.get('content'),
        product=data.get('product'),
        user_id=data.get('userId')
    )
    return jsonify(result) 
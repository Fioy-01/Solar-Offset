from flask import Blueprint, jsonify, request
from flaskr.services.contribution_service import ContributionService

# Blueprint for contribution-related routes
bp = Blueprint('contribution', __name__, url_prefix='/api/contributions')

@bp.route('/', methods=['POST'])
def create_contribution():
    """Create a new contribution"""
    data = request.get_json()
    contribution = ContributionService.create_contribution(
        user_id=data['user_id'],
        project_id=data['project_id'],
        amount=data['amount']
    )
    return jsonify({"message": "Contribution created successfully"}), 201

@bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_contributions(user_id):
    """Get all contributions for a specific user"""
    contributions = ContributionService.get_user_contributions(user_id)
    return jsonify([{
        'id': c.contribution_id,
        'project_id': c.project_id,
        'amount': c.amount,
        'carbon_offset': c.carbon_offset,
        'created_at': c.created_at.isoformat()
    } for c in contributions]), 200

@bp.route('/', methods=['GET'])
def list_contributions():
    """List all contributions (for selection)"""
    contributions = ContributionService.get_all_contributions()
    return jsonify([
        {
            'contribution_id': c.contribution_id,
            'donor_name': c.donor_name,
            'community': c.community  # optional
        } for c in contributions
    ])


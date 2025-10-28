from flask import Blueprint, jsonify, request
from flaskr.services.carbon_footprint_service import CarbonFootprintService

# Blueprint for carbon footprint-related routes
bp = Blueprint('carbon_footprint', __name__, url_prefix='/api/carbon-footprint')

@bp.route('/', methods=['POST'])
def create_footprint():
    """Create a new carbon footprint record"""
    data = request.get_json()
    footprint = CarbonFootprintService.create_footprint(**data)
    return jsonify({"message": "Carbon footprint record created"}), 201

@bp.route('/user/<int:user_id>', methods=['GET'])
def get_user_footprint(user_id):
    """Get carbon footprint for a specific user"""
    footprint = CarbonFootprintService.get_user_footprint(user_id)
    if footprint:
        return jsonify({
            'id': footprint.footprint_id,
            'property_age': footprint.property_age,
            'insulation_level': footprint.insulation_level.value,
            'electricity_usage': footprint.electricity_usage,
            'carbon_footprint': footprint.carbon_footprint
        }), 200
    return jsonify({"error": "Footprint not found"}), 404 

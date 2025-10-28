from flask import Blueprint, jsonify
from flaskr.services.carbon_comparison_service import CarbonComparisonService

bp = Blueprint('carbon_comparison', __name__, url_prefix='/api/carbon-comparison')

@bp.route('/comparison', methods=['GET'])
def get_carbon_comparison():
    result = CarbonComparisonService.get_comparison_data()
    # Compatible with frontend field names
    return jsonify({
        "barData": result.get("barData"),
        "pieData": result.get("pieData"),
        "lineData": result.get("lineData"),
        "equivalentTrees": result.get("equivalentTrees"),
        "pollutionDiff": result.get("pollutionDiff")
    }) 
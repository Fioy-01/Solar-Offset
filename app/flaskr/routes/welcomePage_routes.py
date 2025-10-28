from flask import Blueprint, jsonify, request
from flaskr.services.contribution_service import ContributionService

from flaskr.services.country_service import CountryService

bp = Blueprint('welcome', __name__, url_prefix='/api/statistics')

@bp.route('/summary', methods=['GET'])
def showData():
    countries = len(CountryService.get_all_countries())
    total_carbon = ContributionService.get_total_carbon_offset()
    total_projects = ContributionService.get_completed_projects()
    total_panels = ContributionService.estimate_solar_panels()

    return jsonify({
        'projectsCompleted': total_projects,
        'countriesSupported': countries,
        'panelsInstalled': total_panels,
        'carbonReduced': total_carbon
    }),200

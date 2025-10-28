from flask import Blueprint, jsonify, request
from flaskr.services.country_service import CountryService

bp = Blueprint('country', __name__, url_prefix='/api/countries')

@bp.route('/', methods=['GET'])
def get_countries():
    countries = CountryService.get_all_countries()
    return jsonify([{
        'id': c.country_id,
        'name': c.name,
        'description': c.description,
        'solar_potential': c.solar_potential
    } for c in countries]), 200

@bp.route('/<int:country_id>', methods=['GET'])
def get_country(country_id):
    country = CountryService.get_country_by_id(country_id)
    if country:
        return jsonify({
            'id': country.country_id,
            'name': country.name,
            'description': country.description,
            'population': country.population,
            'solar_potential': country.solar_potential,
            'power_availability': country.power_availability,
            'installation_cost': country.installation_cost,
            'carbon_saving': country.carbon_saving,
            'electricity_output': country.electricity_output
        }), 200
    return jsonify({'error': 'Country not found'}), 404

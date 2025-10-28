from flask import Blueprint, request, jsonify

bp = Blueprint('solar_subsidies', __name__, url_prefix='/api/solar-subsidies')

COUNTRY_DATA = [
    { "id": 1, "country": "Kenya", "renewablepercentage": 89.7, "carbonIntensity": 97.04 },
    { "id": 2, "country": "Turkey", "renewablepercentage": 42.2, "carbonIntensity": 423.18 },
    { "id": 3, "country": "Southern India", "renewablepercentage": 27.31, "carbonIntensity": 503.93 },
    { "id": 4, "country": "South Africa", "renewablepercentage": 11.4, "carbonIntensity": 655.50 },
    { "id": 5, "country": "Singapore", "renewablepercentage": 42.4, "carbonIntensity": 484.75 },
    { "id": 6, "country": "Latvia", "renewablepercentage": 64.4, "carbonIntensity": 194.99 },
    { "id": 7, "country": "Malaysia", "renewablepercentage": 19.8, "carbonIntensity": 464.29 },
]

@bp.route('', methods=['GET'])
def get_solar_subsidies():
    country = request.args.get('country')
    if country:
        filtered = [item for item in COUNTRY_DATA if item['country'] == country]
        return jsonify(filtered)
    return jsonify(COUNTRY_DATA) 
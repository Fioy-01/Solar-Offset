from flask import Blueprint, jsonify
from flaskr.models import Country
from flaskr.services.contribution_service import ContributionService
from flaskr.services.user_service import UserService
from flaskr.services.country_service import CountryService

bp = Blueprint('funding', __name__, url_prefix='/api/funding')

@bp.route('/transactions', methods=['GET'])
def showFundingTransaction():
    contributions = ContributionService.get_all_contributions()
    countries = {c.country_id: c.name for c in CountryService.get_all_countries()}

    result = []
    for c in contributions:
        result.append({
            "id": c.contribution_id,
            "date": c.created_at.strftime("%Y-%m-%d") if c.created_at else None,
            "country": countries.get(c.project_id, "Unknown"),
            "amount": c.amount,
            "panels": c.panels or 0,
            "status": c.status or "unknown",
            "carbonSaved": c.carbon_saved or 0,
            "donorName": c.donor_name or "anonymous",
            "completionDate": c.completion_date.strftime("%Y-%m-%d") if c.completion_date else None,
            "community": c.community or "",
            "beneficiaries": c.beneficiaries or 0
        })

    return jsonify(result)


@bp.route('/countries', methods=['GET'])
def get_country_funding_data():
    countries = Country.query.all()
    data = []

    for c in countries:
        contributions = ContributionService.get_contributions_by_project(c.country_id)
        total_funding = sum(con.amount for con in contributions if con.amount)
        total_panels = sum(con.panels for con in contributions if con.panels)
        installed_panels = sum(con.panels for con in contributions if con.status == 'installed' and con.panels)
        installing_panels = sum(con.panels for con in contributions if con.status == 'installing' and con.panels)
        carbon_saved = sum(con.carbon_saved for con in contributions if con.carbon_saved)

        data.append({
            "country": c.name,
            "totalFunding": total_funding,
            "totalPanels": total_panels,
            "installedPanels": installed_panels,
            "carbonSaved": carbon_saved,
            "projects": len(contributions),
            "activePanels": installed_panels,  # same as installed
            "installingPanels": installing_panels
        })

    return jsonify(data)


@bp.route('/monthly-trends')
def get_monthly_trends():
    trends = ContributionService.get_monthly_funding_trends()
    return jsonify(trends)

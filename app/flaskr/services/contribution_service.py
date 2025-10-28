from sqlalchemy import extract, func
from flaskr.models import Contribution
from flaskr.db import db

SOLAR_PANEL_COST = 500

class ContributionService:
    @staticmethod
    def create_contribution(user_id, project_id, amount, panels=0, status="planning",
                            carbon_saved=0.0, donor_name=None, completion_date=None,
                            community=None, beneficiaries=0):
        """Create a new contribution with extended project metadata"""
        contribution = Contribution(
            user_id=user_id,
            project_id=project_id,
            amount=amount,
            panels=panels,
            status=status,
            carbon_saved=carbon_saved,
            donor_name=donor_name,
            completion_date=completion_date,
            community=community,
            beneficiaries=beneficiaries
        )
        db.session.add(contribution)
        db.session.commit()
        return contribution


    @staticmethod
    def get_user_contributions(user_id):
        """Get all contributions by user ID"""
        return Contribution.query.filter_by(user_id=user_id).all()

    @staticmethod
    def get_project_contributions(project_id):
        """Get all contributions for a project"""
        return Contribution.query.filter_by(project_id=project_id).all() 
    
    @staticmethod
    def get_completed_projects():
        return db.session.query(func.count(Contribution.project_id.distinct())).scalar() or 0
    
    @staticmethod
    def estimate_solar_panels():
        total_amount = db.session.query(func.sum(Contribution.amount)).scalar() or 0
        return total_amount / SOLAR_PANEL_COST
    
    @staticmethod
    def get_total_carbon_offset():
        return db.session.query(func.sum(Contribution.carbon_offset)).scalar() or 0

    
    @staticmethod
    def get_all_contributions():
        """Return all contributions"""
        return Contribution.query.all()


    @staticmethod
    def get_monthly_funding_trends():
        results = (
            db.session.query(
                extract('year', Contribution.created_at).label('year'),
                extract('month', Contribution.created_at).label('month'),
                func.sum(Contribution.amount).label('amount')
            )
            .group_by('year', 'month')
            .order_by('year', 'month')
            .all()
        )

        return [
            {
                "month": f"{int(r.year):04d}-{int(r.month):02d}",
                "amount": float(r.amount)
            }
            for r in results if r.year and r.month
        ]
    
    @staticmethod
    def get_contributions_by_project(project_id):
        return Contribution.query.filter_by(project_id=project_id).all()
    @staticmethod
    def get_all_contributions():
        return Contribution.query.all()

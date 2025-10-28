from flaskr.models import CarbonFootprint
from flaskr.db import db

class CarbonFootprintService:
    @staticmethod
    def create_footprint(user_id, property_age, insulation_level, 
                        electricity_usage, carbon_footprint):
        """Create a new carbon footprint record"""
        footprint = CarbonFootprint(
            user_id=user_id,
            property_age=property_age,
            insulation_level=insulation_level,
            electricity_usage=electricity_usage,
            carbon_footprint=carbon_footprint
        )
        db.session.add(footprint)
        db.session.commit()
        return footprint

    @staticmethod
    def get_user_footprint(user_id):
        """Get carbon footprint by user ID"""
        return CarbonFootprint.query.filter_by(user_id=user_id).first()

    @staticmethod
    def update_footprint(user_id, **kwargs):
        """Update carbon footprint information"""
        footprint = CarbonFootprint.query.filter_by(user_id=user_id).first()
        if footprint:
            for key, value in kwargs.items():
                setattr(footprint, key, value)
            db.session.commit()
        return footprint 
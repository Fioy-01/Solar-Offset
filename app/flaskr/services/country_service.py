from sqlalchemy import func
from flaskr.models import Contribution
from flaskr.models import Country
from flaskr.db import db

class CountryService:
    @staticmethod
    def create_country(name, description, population, solar_potential, 
                      power_availability, installation_cost, carbon_saving, 
                      electricity_output):
        """Create a new country project"""
        country = Country(
            name=name,
            description=description,
            population=population,
            solar_potential=solar_potential,
            power_availability=power_availability,
            installation_cost=installation_cost,
            carbon_saving=carbon_saving,
            electricity_output=electricity_output
        )
        db.session.add(country)
        db.session.commit()
        return country

    @staticmethod
    def get_country_by_id(country_id):
        """Get country by ID"""
        return Country.query.get(country_id)

    @staticmethod
    def get_all_countries():
        """Get all countries"""
        return Country.query.all()

    @staticmethod
    def update_country(country_id, **kwargs):
        """Update country information"""
        country = Country.query.get(country_id)
        if country:
            for key, value in kwargs.items():
                setattr(country, key, value)
            db.session.commit()
        return country 
    
    @staticmethod
    def get_total_carbon_saving():
        total_carbon_saving = db.session.query(func.sum(Country.carbon_saving)).scalar()
        return total_carbon_saving or 0
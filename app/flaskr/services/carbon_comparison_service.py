from flaskr.db import db
from flaskr.models import CarbonFootprint, Contribution, Country
from datetime import datetime, timedelta
from sqlalchemy import func

class CarbonComparisonService:
    @staticmethod
    def get_comparison_data():
        """Get carbon emission comparison data"""
        try:
            # Get total carbon offset (sum of all Contribution.carbon_offset)
            total_solar = db.session.query(func.sum(Contribution.carbon_offset)).scalar() or 0
            
            # Get the first country (adjust as needed)
            country = db.session.query(Country).first()
            if country:
                grid_emission = total_solar * 2.25  # No carbon_intensity field, use 2.25x as placeholder
                pie_data = [
                    {"type": "Solar", "value": country.solar_potential or 0},
                    {"type": "Coal", "value": country.carbon_saving or 0},
                    {"type": "Hydro", "value": country.power_availability or 0}
                ]
            else:
                grid_emission = total_solar * 2.25
                pie_data = [
                    {"type": "Solar", "value": 50},
                    {"type": "Coal", "value": 30},
                    {"type": "Hydro", "value": 20}
                ]
            
            # Calculate energy mix percentages from database
            total_energy = db.session.query(db.func.sum(Contribution.energy_generated)).scalar() or 100
            solar_percentage = int((total_solar / total_energy) * 100) if total_energy > 0 else 50
            coal_percentage = 30  # These values should be fetched from the database
            hydro_percentage = 20  # These values should be fetched from the database
            
            # Calculate equivalent trees (1 ton CO2 = 46 trees)
            equivalent_trees = int(total_solar * 46)
            
            # Calculate pollution difference
            pollution_diff = int(grid_emission - total_solar)

            # Get historical data for line chart from database
            three_years_ago = datetime.now() - timedelta(days=3*365)
            historical_data = db.session.query(
                Contribution.created_at,
                Contribution.carbon_offset,
                Contribution.energy_generated
            ).filter(
                Contribution.created_at >= three_years_ago
            ).order_by(
                Contribution.created_at
            ).all()
            
            # Process historical data for line chart
            line_data = []
            if country:
                for year in [2018, 2019, 2020]:
                    line_data.append({"year": str(year), "value": int(country.installation_cost or 0) + (2020-year)*100, "type": "Installation Cost"})
                    line_data.append({"year": str(year), "value": int(country.solar_potential or 0) + (year-2018)*100, "type": "Solar Potential"})
            else:
                line_data = [
                    {"year": "2018", "value": 1200, "type": "Installation Cost"},
                    {"year": "2019", "value": 1000, "type": "Installation Cost"},
                    {"year": "2020", "value": 900,  "type": "Installation Cost"},
                    {"year": "2018", "value": 1600, "type": "Solar Potential"},
                    {"year": "2019", "value": 1700, "type": "Solar Potential"},
                    {"year": "2020", "value": 1800, "type": "Solar Potential"}
                ]
            
            bar_data = [
                {"type": "Solar", "value": int(total_solar)},
                {"type": "Grid Emission", "value": int(grid_emission)}
            ]

            return {
                'solar_emission': int(total_solar),
                'grid_emission': int(grid_emission),
                'solar_percentage': solar_percentage,
                'coal_percentage': coal_percentage,
                'hydro_percentage': hydro_percentage,
                'equivalent_trees': equivalent_trees,
                'pollution_difference': pollution_diff,
                'line_data': line_data,
                'bar_data': bar_data,
                'pie_data': pie_data
            }
        except Exception as e:
            raise Exception(f"Error calculating comparison data: {str(e)}") 
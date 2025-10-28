from flask import Blueprint, request, jsonify
from flaskr.services.carbon_footprint_service import CarbonFootprintService

bp = Blueprint('carbon_footprint', __name__)

UK_AVERAGE_FOOTPRINT = 3800  # kg CO2/year
SOLAR_PANEL_OFFSET = 320     # 一块太阳能板一年平均减排量 (kg CO2)
SOLAR_PANEL_COST = 500       # 每块太阳能板估算价格 £

@bp.route('/carbon-footprint/calculate', methods=['POST'])
def calculate_carbon_footprint():
    data = request.get_json()

    property_age = data.get('propertyAge')
    insulation = data.get('insulation')
    electricity_type = data.get('electricityType')  # "yearly" or "monthly"
    electricity_usage = data.get('electricityUsage')
    user_id = data.get('userId') 

    if not all([property_age, insulation, electricity_type, electricity_usage]):
        return jsonify({"error": "Missing required fields"}), 400

    # 电量单位换算
    if electricity_type == 'monthly':
        electricity_usage *= 12  # 月度转年度

    # 简单估算碳足迹：电量 × 排放系数（这里取 0.27 kg CO2/kWh）
    emission_factor = 0.27
    carbon_footprint = round(electricity_usage * emission_factor)

    # 与英国平均值对比
    comparison_percentage = round((carbon_footprint - UK_AVERAGE_FOOTPRINT) / UK_AVERAGE_FOOTPRINT * 100)

    suggestions = []
    if insulation == 'poor':
        suggestions.append("Improving the thermal insulation of your home can significantly reduce energy consumption and carbon emissions.")
    if carbon_footprint > UK_AVERAGE_FOOTPRINT:
        suggestions.append("Try to reduce your electricity usage or switch to green energy.")

    # 所需太阳能板数 & 成本
    solar_panels_needed = round(carbon_footprint / SOLAR_PANEL_OFFSET)
    cost_to_offset = solar_panels_needed * SOLAR_PANEL_COST

    # 存储到数据库
    if user_id:
        CarbonFootprintService.create_footprint(
            user_id=user_id,
            property_age=property_age,
            insulation_level=insulation,
            electricity_usage=electricity_usage,
            carbon_footprint=carbon_footprint
        )

    result = {
        "carbonFootprint": carbon_footprint,
        "comparisonPercentage": comparison_percentage,
        "ukAverageCarbonFootprint": UK_AVERAGE_FOOTPRINT,
        "suggestions": suggestions,
        "solarPanelsNeeded": solar_panels_needed,
        "costToOffset": cost_to_offset
    }

    return jsonify(result), 200

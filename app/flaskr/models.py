from datetime import datetime
from flaskr.db import db
from enum import Enum

# Enum definitions
class AccountType(str, Enum):
    HOUSEHOLDER = 'householder'
    ADMIN = 'admin'

class PaymentMethod(str, Enum):
    CREDIT_CARD = 'credit_card'
    DEBIT_CARD = 'debit_card'
    PAYPAL = 'paypal'

class PaymentStatus(str, Enum):
    PENDING = 'pending'
    COMPLETED = 'completed'
    FAILED = 'failed'

class InsulationLevel(str, Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'

class User(db.Model):
    __tablename__ = 'Users'

    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    account_type = db.Column(db.Enum(AccountType), default=AccountType.HOUSEHOLDER)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = db.Column(db.DateTime) 

    # Relationship definitions
    contributions = db.relationship('Contribution', backref='user', lazy=True)
    carbon_footprint = db.relationship('CarbonFootprint', backref='user', uselist=False, lazy=True)
    payments = db.relationship('Payment', backref='user', lazy=True)
    admin_reports = db.relationship('AdminReport', backref='generated_by_user', lazy=True)

    def to_dict(self):
        """Convert user object to dictionary"""
        return {
            'id': self.user_id,
            'username': self.username,
            'email': self.email,
            'is_admin': self.is_admin,
            'account_type': self.account_type.value,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Country(db.Model):
    __tablename__ = 'Countries'

    country_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    population = db.Column(db.Integer)
    solar_potential = db.Column(db.Float)
    power_availability = db.Column(db.Float)
    installation_cost = db.Column(db.Float)
    carbon_saving = db.Column(db.Float)
    electricity_output = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship definitions
    contributions = db.relationship('Contribution', backref='country', lazy=True)

    def to_dict(self):
        """Convert country object to dictionary"""
        return {
            'id': self.country_id,
            'name': self.name,
            'description': self.description,
            'population': self.population,
            'solar_potential': self.solar_potential,
            'power_availability': self.power_availability,
            'installation_cost': self.installation_cost,
            'carbon_saving': self.carbon_saving,
            'electricity_output': self.electricity_output,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Contribution(db.Model):
    __tablename__ = 'Contributions'

    contribution_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('Countries.country_id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    carbon_offset = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    panels = db.Column(db.Integer, default=0)
    status = db.Column(db.String(50), default='planning')
    carbon_saved = db.Column(db.Float, default=0)
    donor_name = db.Column(db.String(255))
    completion_date = db.Column(db.Date)
    community = db.Column(db.String(255))
    beneficiaries = db.Column(db.Integer, default=0)

    def to_dict(self):
        """Convert contribution object to dictionary"""
        return {
            'id': self.contribution_id,
            'user_id': self.user_id,
            'project_id': self.project_id,
            'amount': self.amount,
            'carbon_offset': self.carbon_offset,
            'created_at': self.created_at.isoformat()
        }

class CarbonFootprint(db.Model):
    __tablename__ = 'CarbonFootprint'

    footprint_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    property_age = db.Column(db.Integer)
    insulation_level = db.Column(db.Enum(InsulationLevel), default=InsulationLevel.MEDIUM)
    electricity_usage = db.Column(db.Float)
    carbon_footprint = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert carbon footprint object to dictionary"""
        return {
            'id': self.footprint_id,
            'user_id': self.user_id,
            'property_age': self.property_age,
            'insulation_level': self.insulation_level.value,
            'electricity_usage': self.electricity_usage,
            'carbon_footprint': self.carbon_footprint,
            'created_at': self.created_at.isoformat()
        }

class Payment(db.Model):
    __tablename__ = 'Payments'

    payment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    contribution_id = db.Column(db.Integer, db.ForeignKey('Contributions.contribution_id'), nullable=False)
    payment_method = db.Column(db.Enum(PaymentMethod), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_status = db.Column(db.Enum(PaymentStatus), default=PaymentStatus.PENDING)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert payment object to dictionary"""
        return {
            'id': self.payment_id,
            'user_id': self.user_id,
            'contribution_id': self.contribution_id,
            'payment_method': self.payment_method.value,
            'amount': self.amount,
            'payment_status': self.payment_status.value,
            'created_at': self.created_at.isoformat()
        }

class AdminReport(db.Model):
    __tablename__ = 'AdminReports'

    report_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    report_name = db.Column(db.String(100), nullable=False)
    generated_by = db.Column(db.Integer, db.ForeignKey('Users.user_id'), nullable=False)
    report_data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert admin report object to dictionary"""
        return {
            'id': self.report_id,
            'name': self.report_name,
            'generated_by': self.generated_by,
            'data': self.report_data,
            'created_at': self.created_at.isoformat()
        }



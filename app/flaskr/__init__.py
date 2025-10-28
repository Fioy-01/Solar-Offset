import os
from flask import Flask, jsonify, request
from sqlalchemy import text
from flask_sqlalchemy import SQLAlchemy
from flaskr.db import init_app
from .services.user_service import UserService 
from flaskr.db import db
from flaskr.routes.register_routes import bp as register_bp
from flaskr.routes.login_routes import bp as login_bp
from flaskr.routes.review_routes import bp as review_bp
#db = SQLAlchemy()

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)



    # app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:password@localhost:3306/db"
    # app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    init_app(app)

    # with app.app_context():
    #     from .models import User 
    #     db.create_all()

    # a simple page that says hello
    @app.route('/')
    def hello():
        return 'Hello, World!'
    
    @app.route("/test_db")
    def test_db():
        try:
            db.session.execute(text('SELECT 1'))
            return "Database connected successfully!"
        except Exception as e:
            return f"Database connection failed: {e}"
        

    # Register all blueprints
    from .routes import (
        user_routes, 
        country_routes, 
        contribution_routes,
        carbon_footprint_routes,
        payment_routes,
        admin_report_routes,
        welcomePage_routes,
        funding_routes,
        carbonFootprint_routes
    )
    
    app.register_blueprint(user_routes.bp)
    app.register_blueprint(country_routes.bp)
    app.register_blueprint(contribution_routes.bp)
    #app.register_blueprint(carbon_footprint_routes.bp)
    app.register_blueprint(carbonFootprint_routes.bp, url_prefix='/api')
    app.register_blueprint(payment_routes.bp)
    app.register_blueprint(admin_report_routes.bp)
    app.register_blueprint(welcomePage_routes.bp)
    app.register_blueprint(funding_routes.bp)
    app.register_blueprint(register_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(review_bp)

    return app
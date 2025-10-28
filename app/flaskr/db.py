#from flaskr import db

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_app(app):

    #MySQL 配置
    # MYSQL_USER = "root"  
    # MYSQL_PASSWORD = "password"  
    # MYSQL_HOST = "localhost"  
    # MYSQL_PORT = "3306" 
    # MYSQL_DB = "db"  

    # SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}"
    # SQLALCHEMY_TRACK_MODIFICATIONS = False

    app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:Lyp82ndlf@localhost:3306/world"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    with app.app_context():
        from .models import User 
        db.create_all()
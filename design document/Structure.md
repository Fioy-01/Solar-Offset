# Project Structure Documentation

## Overview

#### Directory Layout
```
flaskr/
├── __init__.py              	# Application factory and configuration
├── db.py                    	# Database initialization and configuration
├── models.py               	# SQLAlchemy models and enums
├── routes/                 	# API route definitions
│   ├── __init__.py        						# Route initialization
│   ├── user_routes.py     						# User-related endpoints
│   ├── country_routes.py  						# Country project endpoints
│   ├── contribution_routes.py  			# Contribution endpoints
│   ├── carbon_footprint_routes.py  	# Carbon footprint endpoints
│   ├── payment_routes.py  						# Payment processing endpoints
│   └── admin_report_routes.py  			# Admin report endpoints
└── services/              		# Business logic layer
    ├── __init__.py       						# Service initialization
    ├── user_service.py   						# User management logic
    ├── country_service.py  					# Country project management
    ├── contribution_service.py  			# Contribution handling
    ├── carbon_footprint_service.py 	# Carbon footprint calculations
    ├── payment_service.py  					# Payment processing logic
    └── admin_report_service.py  			# Report generation and management
```

#### Component Description

1. **__init__.py**
   - Flask application factory
   - Configuration management
   - Blueprint registration

2. **db.py**
   - Database setup
   - SQLAlchemy initialization

3. **models.py**
   - Database models
   - Enum definitions
   - Model relationships

4. **routes/**
   - API endpoint definitions
   - Request handling
   - Response formatting

5. **services/**
   - Business logic implementation
   - Data processing
   - Service layer abstraction 
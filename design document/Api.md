# API Design Documentation

## Overview

#### Description
RESTful API endpoints for the solar energy funding platform.

#### Authentication
Most endpoints require authentication using JWT tokens.

## Endpoints

#### Users API

- **POST /api/users**
  Create a new user account.
  ```json
  {
      "username": "string",
      "email": "string",
      "password": "string"
  }
  ```

- **GET /api/users/{user_id}**
  Get user information.

#### Countries API

- **GET /api/countries**
  Get list of all fundable countries.

- **GET /api/countries/{country_id}**
  Get detailed information about a specific country project.

### Contributions

#### POST /api/contributions
Create a new contribution.
```json
{
    "user_id": "integer",
    "project_id": "integer",
    "amount": "float"
}
```

#### GET /api/contributions/user/{user_id}
Get all contributions for a specific user.

### Carbon Footprint

#### POST /api/carbon-footprint
Create/Update user's carbon footprint.
```json
{
    "user_id": "integer",
    "property_age": "integer",
    "insulation_level": "string",
    "electricity_usage": "float"
}
```

#### GET /api/carbon-footprint/user/{user_id}
Get user's carbon footprint information.

### Payments

#### POST /api/payments
Create a new payment.
```json
{
    "user_id": "integer",
    "contribution_id": "integer",
    "payment_method": "string",
    "amount": "float"
}
```

#### PUT /api/payments/{payment_id}/status
Update payment status.
```json
{
    "status": "string"
}
```

#### GET /api/payments/user/{user_id}
Get all payments for a specific user.

### Admin Reports

#### POST /api/admin/reports
Create a new admin report.
```json
{
    "report_name": "string",
    "generated_by": "integer",
    "report_data": "object"
}
```

#### GET /api/admin/reports
Get all admin reports.

#### GET /api/admin/reports/{report_id}
Get specific admin report details.

## Response Formats

#### Success Response
```json
{
    "message": "string",
    "data": "object"
}
```

#### Error Response
```json
{
    "error": "string",
    "details": "string"
}
```

#### Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
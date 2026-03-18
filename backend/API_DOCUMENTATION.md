# BuySimply Backend API

## Overview
A production-ready NestJS REST API for managing loans and user authentication with role-based access control.

## Features
- ✅ JWT-based authentication with role-based authorization
- ✅ Role-based access control (SuperAdmin, Admin, Staff)
- ✅ Loan management with sensitive data filtering
- ✅ API rate limiting (throttling)
- ✅ Global error handling
- ✅ CORS support
- ✅ HTTP request logging with Morgan
- ✅ TypeScript with strict typing

## Installation

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the application
npm run start

# Start in development mode
npm run start:dev
```

## Environment Configuration

Create a `.env` file in the backend root directory:

```env
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
JWT_SECRET=secretKey_for_demo_purposes_only
JWT_EXPIRATION=1h
```

## API Endpoints

### Authentication Routes

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "edwinjohn@example.com",
  "password": "12345Pass"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Edwin John",
    "email": "edwinjohn@example.com",
    "role": "superAdmin"
  }
}
```

#### Logout
```
POST /auth/logout
Authorization: Bearer <access_token>

Response:
{
  "message": "Logged out successfully"
}
```

### Loans Routes (Protected)

All loan endpoints require authentication with valid JWT token in Authorization header.

#### Get All Loans
```
GET /loans
Authorization: Bearer <access_token>

Response:
[
  {
    "id": "900199",
    "amount": "₦5,587,858",
    "maturityDate": "2024-03-25 14:27:37",
    "status": "active",
    "applicant": {
      "name": "Alexander Janet",
      "email": "alexanderjanet@tester.com",
      "telephone": "+14958403848",
      "totalLoan": "₦14,234,433,454"  // Only visible to admin/superAdmin
    },
    "createdAt": "2024-01-25 14:27:37"
  }
]
```

#### Filter Loans by Status
```
GET /loans?status=pending
GET /loans?status=active
Authorization: Bearer <access_token>

Response: Filtered loans array
```

#### Get User's Loans
```
GET /loans/:userEmail/get
Authorization: Bearer <access_token>

Example: GET /loans/alexanderjanet@tester.com/get

Response:
{
  "loans": [...]
}

Note: Returns empty array if user has no loans
{
  "loans": []
}
```

#### Get Expired Loans
```
GET /loans/expired
Authorization: Bearer <access_token>

Response: Array of loans with maturityDate in the past
```

#### Delete Loan (SuperAdmin Only)
```
DELETE /loan/:loanId/delete
Authorization: Bearer <access_token>

Example: DELETE /loan/900199/delete

Requires: superAdmin role

Response:
{
  "message": "Loan 900199 deleted successfully"
}

Error Response (Forbidden):
{
  "statusCode": 403,
  "message": "You do not have permission to access this resource",
  "timestamp": "2024-03-18T14:30:00.000Z",
  "path": "/loan/900199/delete",
  "method": "DELETE"
}
```

## Role-Based Access Control

### Staff Role
- ✅ Can view all loans
- ✅ Can filter loans by status
- ✅ Can view expired loans
- ✅ Can view their own loans
- ❌ Cannot see applicant's `totalLoan` field
- ❌ Cannot delete loans

### Admin Role
- ✅ Can view all loans (including totalLoan)
- ✅ Can filter loans by status
- ✅ Can view expired loans
- ✅ Can view any user's loans
- ✅ Can see all applicant details
- ❌ Cannot delete loans

### SuperAdmin Role
- ✅ Can view all loans (including totalLoan)
- ✅ Can filter loans by status
- ✅ Can view expired loans
- ✅ Can view any user's loans
- ✅ Can see all applicant details
- ✅ **Can delete loans**

## Test Credentials

**SuperAdmin:**
```
Email: edwinjohn@example.com
Password: 12345Pass
```

**Admin:**
```
Email: jp@example.com
Password: 1234567Pass
```

**Staff:**
```
Email: ladam@example.com
Password: 123456789Pass
```

## Error Handling

All errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "timestamp": "2024-03-18T14:30:00.000Z",
  "path": "/loans",
  "method": "GET"
}
```

### Common Error Codes

| Code | Message | Cause |
|------|---------|-------|
| 400 | Bad Request | Invalid input parameters |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Insufficient permissions for action |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Short window:** 10 requests per minute
- **Long window:** 100 requests per hour

When rate limit is exceeded:
```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests",
  "timestamp": "2024-03-18T14:30:00.000Z",
  "path": "/loans",
  "method": "GET"
}
```

## Project Structure

```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── roles.decorator.ts
│   ├── loans/
│   │   ├── loans.controller.ts
│   │   ├── loans.service.ts
│   │   └── loans.module.ts
│   ├── common/
│   │   └── global-error.filter.ts
│   ├── app.module.ts
│   └── main.ts
├── package.json
└── README.md
```

## Running the Application

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start

# With custom port
PORT=3001 npm run start:dev
```

## Logging

The application logs all significant events:

- User login/logout attempts
- Role-based access denials
- Loan operations
- Data loading/saving operations
- API errors

Logs are output to console and can be configured for file storage in production.

## Security Considerations

- JWT tokens expire after 1 hour
- Passwords are stored in plain text (use bcrypt in production)
- Admin credentials should be moved to environment variables
- CORS is open to all origins in development (restrict in production)
- API rate limiting should be tuned for production load

## Future Enhancements

- [ ] Password hashing with bcrypt
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Email verification for logout
- [ ] Audit logging for sensitive operations
- [ ] Swagger/OpenAPI documentation
- [ ] Unit and integration tests
- [ ] CI/CD pipeline
- [ ] Docker containerization

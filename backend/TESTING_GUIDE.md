## Quick API Testing Guide

### Using cURL

#### 1. Login as SuperAdmin
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "edwinjohn@example.com",
    "password": "12345Pass"
  }'
```

Expected Response:
```json
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

#### 2. Get All Loans (as SuperAdmin)
```bash
curl -X GET http://localhost:3000/loans \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

#### 3. Filter Loans by Status
```bash
# Get pending loans
curl -X GET "http://localhost:3000/loans?status=pending" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"

# Get active loans
curl -X GET "http://localhost:3000/loans?status=active" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

#### 4. Get User's Loans
```bash
curl -X GET "http://localhost:3000/loans/alexanderjanet@tester.com/get" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

#### 5. Get Expired Loans
```bash
curl -X GET http://localhost:3000/loans/expired \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

#### 6. Delete a Loan (SuperAdmin only)
```bash
curl -X DELETE "http://localhost:3000/loan/900199/delete" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

#### 7. Logout
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Using Postman (or similar tools)

1. **Import Collection:**
   - Create a new Postman workspace
   - Create requests for each endpoint

2. **Set up variables:**
   - Save the `access_token` from login response as a Postman variable
   - Use `{{access_token}}` in Authorization headers

3. **Test Workflow:**
   ```
   1. POST /auth/login → Get token
   2. GET /loans → View all loans
   3. GET /loans?status=pending → Filter by status
   4. GET /loans/:email/get → Get user loans
   5. GET /loans/expired → Get expired loans
   6. DELETE /loan/:id/delete → Delete loan (SuperAdmin)
   7. POST /auth/logout → Logout
   ```

### Using Thunder Client (VS Code Extension)

1. Install "Thunder Client" extension
2. Create requests with:
   - **Auth Tab:** Select "Bearer Token"
   - **Paste access_token** from login response

### Testing Role-Based Access

#### As Staff User (ladam@example.com)
```bash
# Login
ACCESS_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ladam@example.com","password":"123456789Pass"}' \
  | jq -r '.access_token')

# Get loans - Note: totalLoan field will be missing
curl -X GET http://localhost:3000/loans \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq
```

#### As Admin User (jp@example.com)
```bash
# Login
ACCESS_TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jp@example.com","password":"1234567Pass"}' \
  | jq -r '.access_token')

# Get loans - Note: totalLoan field will be visible
curl -X GET http://localhost:3000/loans \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq
```

### Observe Differences in Response

**Staff Response (totalLoan hidden):**
```json
{
  "applicant": {
    "name": "Alexander Janet",
    "email": "alexanderjanet@tester.com",
    "telephone": "+14958403848"
  }
}
```

**Admin/SuperAdmin Response (totalLoan visible):**
```json
{
  "applicant": {
    "name": "Alexander Janet",
    "email": "alexanderjanet@tester.com",
    "telephone": "+14958403848",
    "totalLoan": "₦14,234,433,454"
  }
}
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Ensure token is included in Authorization header and hasn't expired |
| 403 Forbidden | User role doesn't have permission for this action |
| 404 Not Found | Resource ID is incorrect or doesn't exist |
| 429 Too Many Requests | Rate limit exceeded, wait before making more requests |
| Invalid email or password | Check credentials in staffs.json |

### Performance Testing

Test rate limiting:
```bash
# Make 15 requests rapidly (should fail after 10)
for i in {1..15}; do
  curl -s http://localhost:3000/loans \
    -H "Authorization: Bearer YOUR_TOKEN" | jq '.statusCode' &
done
```

### Debugging

Enable verbose logging:
```bash
# Check logs for detailed operation info
# Logs include:
# - Staff data loading
# - Loans data loading
# - User login attempts
# - Role-based access denials
# - Loan operations
```

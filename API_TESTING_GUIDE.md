# API Testing Guide - HealthTech Prescription Management System

This guide provides curl commands to test all API endpoints. Make sure the server is running on port 3000.

## Health Check

```bash
curl -X GET http://localhost:3000/health
```

Response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-05-07T10:30:00.000Z"
}
```

---

## 1. USER REGISTRATION & AUTHENTICATION

### Register as Doctor
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dr_johnson",
    "email": "dr.johnson@healthtech.com",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "role": "doctor",
    "first_name": "Michael",
    "last_name": "Johnson",
    "specialization": "Cardiology",
    "license_number": "MED-2024-12345"
  }'
```

### Register as Patient
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "patient_smith",
    "email": "john.smith@example.com",
    "password": "PatientPass123!",
    "confirmPassword": "PatientPass123!",
    "role": "patient",
    "first_name": "John",
    "last_name": "Smith"
  }'
```

### Login as Doctor
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dr_johnson",
    "password": "SecurePass123!"
  }'
```

Response will include JWT token:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "dr_johnson",
    "email": "dr.johnson@healthtech.com",
    "role": "doctor",
    "first_name": "Michael",
    "last_name": "Johnson"
  }
}
```

**Save the token for subsequent requests**

---

## 2. USER PROFILE MANAGEMENT

### Get User Profile
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Update User Profile
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "first_name": "Michael",
    "last_name": "Johnson",
    "email": "michael.johnson@healthtech.com",
    "specialization": "Cardiology",
    "license_number": "MED-2024-12345"
  }'
```

---

## 3. DOCTOR-SPECIFIC ENDPOINTS

### Get All Doctors
```bash
curl -X GET http://localhost:3000/api/users/doctors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Get My Patients (Doctor Only)
```bash
curl -X GET http://localhost:3000/api/users/my-patients \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## 4. PRESCRIPTION MANAGEMENT

### Create Prescription (Doctor Only)
```bash
curl -X POST http://localhost:3000/api/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_JWT_TOKEN" \
  -d '{
    "patient_id": 2,
    "medication_name": "Aspirin",
    "dosage": "500mg",
    "frequency": "3 times a day after meals",
    "duration": "7 days",
    "instructions": "Take with food to avoid stomach upset",
    "notes": "For general pain and fever relief"
  }'
```

### Get All Prescriptions
```bash
curl -X GET http://localhost:3000/api/prescriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Note:** Doctors see prescriptions they created, patients see prescriptions assigned to them.

### Get Prescription by ID
```bash
curl -X GET http://localhost:3000/api/prescriptions/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### Update Prescription (Doctor Only)
```bash
curl -X PUT http://localhost:3000/api/prescriptions/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer DOCTOR_JWT_TOKEN" \
  -d '{
    "medication_name": "Ibuprofen",
    "dosage": "400mg",
    "frequency": "2 times a day",
    "duration": "10 days",
    "status": "active",
    "instructions": "Take with meals"
  }'
```

### Delete Prescription (Doctor Only)
```bash
curl -X DELETE http://localhost:3000/api/prescriptions/1 \
  -H "Authorization: Bearer DOCTOR_JWT_TOKEN"
```

### View All Prescriptions (Admin View)
```bash
curl -X GET http://localhost:3000/api/prescriptions/admin/all \
  -H "Authorization: Bearer DOCTOR_JWT_TOKEN"
```

---

## Testing Sequence

### Step 1: Register Users
1. Register a doctor account
2. Register a patient account

### Step 2: Login
1. Login as doctor, save token
2. Login as patient, save token

### Step 3: Create Prescription
1. Use doctor token to create prescription for patient

### Step 4: View Prescriptions
1. Use doctor token - should see prescriptions they created
2. Use patient token - should see prescriptions assigned to them

### Step 5: Update & Delete
1. Use doctor token to update prescription
2. Use doctor token to delete prescription

### Step 6: Authorization Tests
1. Try to access doctor endpoint with patient token - should fail
2. Try to access patient's prescription with different patient token - should fail

---

## Error Handling Examples

### Invalid Token
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer invalid_token"
```

Response:
```json
{
  "success": false,
  "message": "Invalid or malformed token",
  "code": "INVALID_TOKEN"
}
```

### Validation Error
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ab",
    "email": "invalid-email"
  }'
```

Response:
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "username",
      "message": "Username must be at least 3 characters"
    },
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Authorization Error
```bash
curl -X POST http://localhost:3000/api/prescriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer PATIENT_JWT_TOKEN" \
  -d '{
    "patient_id": 3,
    "medication_name": "Aspirin",
    "dosage": "500mg",
    "frequency": "Daily",
    "duration": "7 days"
  }'
```

Response:
```json
{
  "success": false,
  "message": "Access denied. Required role: doctor",
  "code": "INSUFFICIENT_PERMISSIONS"
}
```

---

## Using Postman

1. Import the `postman-collection.json` file into Postman
2. Create a "healthtech" environment
3. Set variable `base_url` = `http://localhost:3000`
4. Set variable `token` after login (copy token value)
5. Run requests from the collection

---

## Notes

- Replace `YOUR_JWT_TOKEN_HERE` with actual token from login
- Replace `DOCTOR_JWT_TOKEN` with doctor's token for protected endpoints
- Replace `PATIENT_JWT_TOKEN` with patient's token
- All timestamps are in UTC
- Tokens expire after 7 days by default (configurable in .env)

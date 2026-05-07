# HealthTech Prescription Management System

A comprehensive backend system for managing medical prescriptions with role-based access control using Node.js, Express.js, and SQLite3. This project implements a complete MVC architecture with JWT authentication and role-based authorization.

## 🎯 Project Overview

This assignment implements a secure HealthTech Prescription Management System with the following features:

### ✅ Core Requirements Met
- ✓ **Node.js & Express.js** backend framework
- ✓ **SQLite3** database with relational design
- ✓ **MVC Architecture** with Models, Controllers, and Routes
- ✓ **JWT Authentication** with secure token management
- ✓ **Role-Based Access Control (RBAC)** for Doctors and Patients
- ✓ **Input Validation** using express-validator
- ✓ **Password Security** with bcrypt hashing
- ✓ **Error Handling** with proper HTTP status codes
- ✓ **CORS** support for cross-origin requests

## 🔐 Features

### Authentication & Security
- JWT-based token authentication with expiration
- Bcrypt password hashing with salt rounds
- Role-based access control (RBAC)
- Secure password validation
- Token verification middleware
- Unauthorized access prevention

### User Roles

#### 👨‍⚕️ **Doctor**
- Register with specialization and license number
- Login with credentials
- Create prescriptions for patients
- Update existing prescriptions
- Delete own prescriptions
- View all their own prescriptions
- View assigned patients
- View patient profiles

#### 👤 **Patient**
- Register with basic information
- Login with credentials
- View only their assigned prescriptions
- View prescription details securely
- Read-only access to prescription data
- Cannot create or modify prescriptions

### Prescription Management
- Create prescriptions with detailed medication information
- Update prescription details (doctors only)
- Delete prescriptions (doctors only)
- View prescriptions with role-based filtering
- Mark prescriptions as active/inactive/completed
- Support for medication dosage, frequency, and duration
- Special instructions and notes support
- Automatic timestamp tracking

### Data Management
- User profile management
- Relational database with foreign keys
- Audit logging for compliance
- Data validation at all levels
- Indexed queries for performance

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Backend Framework** | Express.js 4.18.2 |
| **Database** | SQLite3 5.1.6 |
| **Authentication** | JWT (jsonwebtoken 9.0.0) |
| **Password Hashing** | Bcrypt 5.1.0 |
| **Input Validation** | express-validator 7.0.0 |
| **Environment Config** | dotenv 16.0.3 |
| **Development** | Nodemon 2.0.20 |
| **CORS** | cors 2.8.5 |

## 📁 Project Structure

```
healthtech-prescription-management/
├── src/
│   ├── config/
│   │   └── database.js                    # SQLite database connection & initialization
│   ├── controllers/
│   │   ├── UserController.js              # User registration, login, profile management
│   │   └── PrescriptionController.js      # Prescription CRUD operations
│   ├── middleware/
│   │   ├── auth.js                        # JWT authentication & role verification
│   │   └── validation.js                  # Input validation error handling
│   ├── models/
│   │   ├── User.js                        # User database operations
│   │   └── Prescription.js                # Prescription database operations
│   └── routes/
│       ├── userRoutes.js                  # User endpoints
│       └── prescriptionRoutes.js          # Prescription endpoints
├── data/
│   └── healthtech.db                      # SQLite database file
├── server.js                              # Main Express server
├── .env                                   # Environment variables
├── .env.example                           # Environment template
├── .gitignore                             # Git ignore rules
├── package.json                           # Project dependencies
├── package-lock.json                      # Locked dependency versions
├── schema.sql                             # Database schema with indexes
├── queries.sql                            # Sample SQL queries
├── API_TESTING_GUIDE.md                   # Complete API testing guide
├── postman-collection.json                # Postman collection
├── README.md                              # This file
└── node_modules/                          # Project dependencies
```

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v14 or higher
- **npm** v6 or higher (Node Package Manager)
- Git (for version control)

### Step 1: Install Dependencies
```bash
npm install
```

Dependencies installed:
- express (web framework)
- sqlite3 (database)
- bcrypt (password hashing)
- jsonwebtoken (JWT tokens)
- express-validator (input validation)
- dotenv (environment variables)
- cors (cross-origin requests)

### Step 2: Environment Configuration
The `.env` file is pre-configured with:
```env
PORT=3000
DATABASE_PATH=./data/healthtech.db
JWT_SECRET=your_jwt_secret_key_change_in_production
NODE_ENV=development
```

**For Production**: Update `JWT_SECRET` to a strong, unique value

### Step 3: Start the Server
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

Expected output:
```
╔════════════════════════════════════════════════════╗
║  HealthTech Prescription Management System        ║
║  Server running on port 3000                      ║
║  Environment: development                         ║
╚════════════════════════════════════════════════════╝

Connected to SQLite database at: ./data/healthtech.db
Users table initialized
Prescriptions table initialized
Audit logs table initialized
```

### Step 4: Verify Server
```bash
curl http://localhost:3000/health
```

4. **Start the server**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3000`

## API Endpoints

### User Management

#### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "username": "doctor1",
  "email": "doctor1@healthtech.com",
  "password": "password123",
  "confirmPassword": "password123",
  "role": "doctor",
  "first_name": "John",
  "last_name": "Smith",
  "specialization": "Cardiology",
  "license_number": "LIC-2024-001"
}
```

#### Login
```
POST /api/users/login
Content-Type: application/json

{
  "username": "doctor1",
  "password": "password123"
}
```

Response includes JWT token:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "doctor1",
    "email": "doctor1@healthtech.com",
    "role": "doctor",
    "first_name": "John",
    "last_name": "Smith"
  }
}
```

#### Get User Profile
```
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update User Profile
```
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "Jonathan",
  "last_name": "Smith",
  "email": "jonathan@healthtech.com",
  "specialization": "Cardiology",
  "license_number": "LIC-2024-001"
}
```

#### Get All Doctors
```
GET /api/users/doctors
Authorization: Bearer <token>
```

#### Get My Patients (Doctor Only)
```
GET /api/users/my-patients
Authorization: Bearer <token>
```

### Prescription Management

#### Create Prescription (Doctor Only)
```
POST /api/prescriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "patient_id": 2,
  "medication_name": "Aspirin",
  "dosage": "500mg",
  "frequency": "3 times a day",
  "duration": "7 days",
  "instructions": "Take with food",
  "notes": "For headache relief"
}
```

#### Get All Prescriptions (User-Specific)
```
GET /api/prescriptions
Authorization: Bearer <token>
```
- Doctors see prescriptions they created
- Patients see prescriptions assigned to them

#### Get Prescription by ID
```
GET /api/prescriptions/:id
Authorization: Bearer <token>
```

#### Update Prescription (Doctor Only)
```
PUT /api/prescriptions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "medication_name": "Aspirin",
  "dosage": "500mg",
  "frequency": "2 times a day",
  "duration": "14 days",
  "status": "active",
  "instructions": "Take with food",
  "notes": "Increased dosage"
}
```

#### Delete Prescription (Doctor Only)
```
DELETE /api/prescriptions/:id
Authorization: Bearer <token>
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('doctor', 'patient')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  specialization TEXT,
  license_number TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Prescriptions Table
```sql
CREATE TABLE prescriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  doctor_id INTEGER NOT NULL,
  patient_id INTEGER NOT NULL,
  medication_name TEXT NOT NULL,
  dosage TEXT NOT NULL,
  frequency TEXT NOT NULL,
  duration TEXT NOT NULL,
  instructions TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive', 'completed')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id INTEGER,
  old_values TEXT,
  new_values TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

## 🔐 Authorization Rules

### Doctor Authorization
- ✓ Can create prescriptions
- ✓ Can update own prescriptions
- ✓ Can delete own prescriptions
- ✓ Can view own prescriptions only
- ✓ Can view assigned patients
- ✗ Cannot view other doctors' prescriptions
- ✗ Cannot modify other doctors' prescriptions

### Patient Authorization
- ✓ Can view their assigned prescriptions
- ✓ Can view prescription details
- ✗ Cannot create prescriptions
- ✗ Cannot modify prescriptions
- ✗ Cannot delete prescriptions
- ✗ Cannot view other patients' prescriptions

## ✅ Validation Rules

### User Registration
- Username: Minimum 3 characters, unique
- Email: Valid email format, unique
- Password: Minimum 6 characters
- Password confirmation: Must match password
- Role: Must be "doctor" or "patient"
- First name & Last name: Required, not empty
- Specialization: Required for doctors
- License number: Required for doctors

### Prescription Creation
- Patient ID: Must be valid integer, must be patient role
- Medication name: Required, not empty
- Dosage: Required, not empty
- Frequency: Required, not empty
- Duration: Required, not empty
- Instructions: Optional
- Notes: Optional

## 🔒 Security Features

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Password never stored in plain text
   - Password comparison using bcrypt.compare()

2. **Authentication**
   - JWT tokens with expiration (7 days)
   - Token validation on protected routes
   - Token refresh capability

3. **Authorization**
   - Role-based access control middleware
   - Resource ownership verification
   - Unauthorized access prevention with 403 status

4. **Input Validation**
   - express-validator for all endpoints
   - SQL injection prevention (parameterized queries)
   - XSS protection (no direct HTML injection)

5. **Error Handling**
   - Proper HTTP status codes
   - Detailed error messages with codes
   - No sensitive data in error responses
   - Global error handler middleware

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE"
}
```

## 🧪 Testing

For complete API testing instructions, see [API_TESTING_GUIDE.md](API_TESTING_GUIDE.md)

### Quick Test
```bash
# Health check
curl http://localhost:3000/health

# API info
curl http://localhost:3000/
```

### Postman Collection
Import `postman-collection.json` into Postman for easy API testing with pre-configured requests.

## 📊 Database Queries

Common SQL queries are available in [queries.sql](queries.sql) including:
- User authentication queries
- Patient management queries
- Prescription CRUD operations
- Audit log queries

## 🐛 Error Codes

| Code | Status | Description |
|------|--------|-------------|
| MISSING_CREDENTIALS | 400 | Username or password missing |
| PASSWORD_MISMATCH | 400 | Passwords do not match during registration |
| INVALID_CREDENTIALS | 401 | Invalid username or password |
| NO_TOKEN | 401 | JWT token not provided |
| INVALID_TOKEN | 403 | JWT token is invalid or malformed |
| TOKEN_EXPIRED | 401 | JWT token has expired |
| USER_INACTIVE | 403 | User account is inactive |
| INSUFFICIENT_PERMISSIONS | 403 | User role not authorized |
| USERNAME_EXISTS | 409 | Username already taken |
| EMAIL_EXISTS | 409 | Email already registered |
| PATIENT_NOT_FOUND | 404 | Patient user not found |
| NOT_A_PATIENT | 400 | Selected user is not a patient |
| PRESCRIPTION_NOT_FOUND | 404 | Prescription not found |
| FORBIDDEN | 403 | Access denied to resource |
| DB_ERROR | 500 | Database operation error |
| INTERNAL_ERROR | 500 | Internal server error |

## 🚀 Running the Application

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the server**
   ```bash
   npm start
   ```

3. **Server is ready**
   ```
   Server running on http://localhost:3000
   ```

## 📦 Project Deliverables

✅ **Completed**
- [x] Source code with MVC architecture
- [x] SQLite3 database schema
- [x] User authentication (JWT)
- [x] Role-based authorization
- [x] CRUD operations for prescriptions
- [x] Input validation
- [x] Error handling
- [x] Database configuration
- [x] Middleware for auth and validation
- [x] API testing documentation
- [x] Postman collection
- [x] Sample SQL queries
- [x] Complete README
- [x] GitHub repository ready

## 📄 License

MIT License - This project is open source and available under the MIT License.

## 👥 Author

HealthTech Development Team

## 📞 Support

For issues and questions, please refer to the API_TESTING_GUIDE.md or check the implementation in the src/ directory.

---

**Last Updated**: May 7, 2026
**Version**: 1.0.0
```

#### Update Prescription (Doctor Only)
```
PUT /api/prescriptions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "medication_name": "Ibuprofen",
  "dosage": "400mg",
  "frequency": "2 times a day",
  "duration": "10 days",
  "status": "active",
  "instructions": "Take with meals"
}
```

#### Delete Prescription (Doctor Only)
```
DELETE /api/prescriptions/:id
Authorization: Bearer <token>
```

#### Get All Prescriptions (Admin View)
```
GET /api/prescriptions/admin/all
Authorization: Bearer <token>
```

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

The token is obtained from the login endpoint and has an expiration time set in the `.env` file (default: 7 days).

## Database Schema

### Users Table
- Stores doctor and patient information
- Fields: id, username, email, password, role, first_name, last_name, specialization, license_number, is_active, created_at, updated_at

### Prescriptions Table
- Stores prescription records
- Fields: id, doctor_id, patient_id, medication_name, dosage, frequency, duration, instructions, notes, status, created_at, updated_at
- Foreign keys: doctor_id (users), patient_id (users)

### Audit Logs Table
- Tracks user actions for security and compliance
- Fields: id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, created_at

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `NO_TOKEN`: No authorization token provided
- `INVALID_TOKEN`: Token is invalid or malformed
- `TOKEN_EXPIRED`: Token has expired
- `INSUFFICIENT_PERMISSIONS`: User role lacks required permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `USERNAME_EXISTS`: Username already registered
- `EMAIL_EXISTS`: Email already registered
- `INVALID_CREDENTIALS`: Incorrect username or password

## Security Features

1. **Password Security**
   - Bcrypt hashing with salt rounds
   - Password strength validation

2. **Token Security**
   - JWT with configurable expiration
   - Token verification on protected routes

3. **Role-Based Authorization**
   - Middleware for role verification
   - Resource-level authorization checks

4. **SQL Security**
   - Foreign key constraints
   - Parameterized queries to prevent SQL injection

5. **Data Validation**
   - Input validation on all endpoints
   - Email format validation
   - Type checking

## Sample Test Data

The system is ready for testing. You can:

1. Register a doctor account
   ```
   POST /api/users/register
   role: "doctor"
   ```

2. Register a patient account
   ```
   POST /api/users/register
   role: "patient"
   ```

3. Create a prescription
   ```
   POST /api/prescriptions (as doctor)
   ```

4. View prescriptions
   ```
   GET /api/prescriptions (as patient - see only their own)
   ```

## Development Notes

### Adding New Endpoints

1. Create a model method in `src/models/`
2. Create a controller method in `src/controllers/`
3. Add route in `src/routes/`
4. Apply middleware as needed

### Adding New Database Tables

1. Add CREATE TABLE statement to `src/config/database.js`
2. Update schema.sql with the new table definition
3. Create corresponding model class

## Future Enhancements

- Admin dashboard for system monitoring
- Prescription renewal feature
- Patient medication history
- Prescription expiration notifications
- Doctor ratings and reviews
- Appointment scheduling integration
- Email notifications
- SMS alerts for prescription status changes
- Mobile app support

## License

MIT License - See LICENSE file for details

## Contact

For questions or support, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: 2024

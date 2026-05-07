require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const prescriptionRoutes = require('./src/routes/prescriptionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

app.get('/health', function(req, res) {
  res.status(200).json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

app.get('/', function(req, res) {
  res.status(200).json({
    success: true,
    message: 'HealthTech Prescription Management System API',
    version: '1.0.0',
    endpoints: {
      users: {
        register: 'POST /api/users/register',
        login: 'POST /api/users/login',
        profile: 'GET /api/users/profile',
        updateProfile: 'PUT /api/users/profile',
        getAllDoctors: 'GET /api/users/doctors',
        getMyPatients: 'GET /api/users/my-patients'
      },
      prescriptions: {
        create: 'POST /api/prescriptions',
        getAll: 'GET /api/prescriptions',
        getById: 'GET /api/prescriptions/:id',
        update: 'PUT /api/prescriptions/:id',
        delete: 'DELETE /api/prescriptions/:id'
      }
    }
  });
});

app.use(function(err, req, res, next) {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error', code: 'INTERNAL_ERROR' });
});

app.use(function(req, res) {
  res.status(404).json({ success: false, message: 'Endpoint not found', code: 'NOT_FOUND' });
});

app.listen(PORT, function() {
  console.log('Server running on port ' + PORT);
  console.log('Environment: ' + (process.env.NODE_ENV || 'development'));
});

module.exports = app;

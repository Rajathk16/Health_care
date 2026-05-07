const express = require('express');
const { body } = require('express-validator');
const UserController = require('../controllers/UserController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/register',
  [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').custom(function(value, { req }) { return value === req.body.password; }).withMessage('Passwords do not match'),
    body('role').isIn(['doctor', 'patient']).withMessage('Role must be either doctor or patient'),
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required')
  ],
  handleValidationErrors,
  UserController.register
);

router.post('/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  handleValidationErrors,
  UserController.login
);

router.get('/profile', authMiddleware, UserController.getProfile);

router.put('/profile',
  authMiddleware,
  [
    body('first_name').optional().notEmpty().withMessage('First name cannot be empty'),
    body('last_name').optional().notEmpty().withMessage('Last name cannot be empty'),
    body('email').optional().isEmail().withMessage('Invalid email format')
  ],
  handleValidationErrors,
  UserController.updateProfile
);

router.get('/doctors', authMiddleware, UserController.getAllDoctors);

router.get('/my-patients', authMiddleware, roleMiddleware('doctor'), UserController.getPatientsByDoctorId);

module.exports = router;

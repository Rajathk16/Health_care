const express = require('express');
const { body, param } = require('express-validator');
const PrescriptionController = require('../controllers/PrescriptionController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

router.post('/',
  authMiddleware,
  roleMiddleware('doctor'),
  [
    body('patient_id').isInt().withMessage('Patient ID must be an integer'),
    body('medication_name').notEmpty().withMessage('Medication name is required'),
    body('dosage').notEmpty().withMessage('Dosage is required'),
    body('frequency').notEmpty().withMessage('Frequency is required'),
    body('duration').notEmpty().withMessage('Duration is required'),
    body('instructions').optional().isString(),
    body('notes').optional().isString()
  ],
  handleValidationErrors,
  PrescriptionController.create
);

router.get('/', authMiddleware, PrescriptionController.getAll);

router.get('/:id',
  authMiddleware,
  [param('id').isInt().withMessage('Invalid prescription ID')],
  handleValidationErrors,
  PrescriptionController.getById
);

router.put('/:id',
  authMiddleware,
  roleMiddleware('doctor'),
  [
    param('id').isInt().withMessage('Invalid prescription ID'),
    body('medication_name').optional().notEmpty().withMessage('Medication name cannot be empty'),
    body('dosage').optional().notEmpty().withMessage('Dosage cannot be empty'),
    body('frequency').optional().notEmpty().withMessage('Frequency cannot be empty'),
    body('duration').optional().notEmpty().withMessage('Duration cannot be empty'),
    body('status').optional().isIn(['active', 'inactive', 'completed']).withMessage('Invalid status'),
    body('instructions').optional().isString(),
    body('notes').optional().isString()
  ],
  handleValidationErrors,
  PrescriptionController.update
);

router.delete('/:id',
  authMiddleware,
  roleMiddleware('doctor'),
  [param('id').isInt().withMessage('Invalid prescription ID')],
  handleValidationErrors,
  PrescriptionController.delete
);

router.get('/admin/all', authMiddleware, roleMiddleware('doctor'), PrescriptionController.getAllPrescriptions);

module.exports = router;

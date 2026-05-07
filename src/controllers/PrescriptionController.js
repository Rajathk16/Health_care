const Prescription = require('../models/Prescription');
const User = require('../models/User');

class PrescriptionController {
  static create(req, res) {
    const doctorId = req.user.id;
    const { patient_id, medication_name, dosage, frequency, duration, instructions, notes } = req.body;

    User.findById(patient_id, function(err, patient) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
      }

      if (!patient) {
        return res.status(404).json({ success: false, message: 'Patient not found', code: 'PATIENT_NOT_FOUND' });
      }

      if (patient.role !== 'patient') {
        return res.status(400).json({ success: false, message: 'Selected user is not a patient', code: 'NOT_A_PATIENT' });
      }

      Prescription.create({ doctor_id: doctorId, patient_id, medication_name, dosage, frequency, duration, instructions, notes }, function(err, prescription) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error creating prescription', code: 'CREATE_ERROR' });
        }

        res.status(201).json({ success: true, message: 'Prescription created successfully', data: prescription });
      });
    });
  }

  static getById(req, res) {
    const id = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    Prescription.findById(id, function(err, prescription) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
      }

      if (!prescription) {
        return res.status(404).json({ success: false, message: 'Prescription not found', code: 'NOT_FOUND' });
      }

      if (userRole === 'doctor' && prescription.doctor_id !== userId) {
        return res.status(403).json({ success: false, message: 'You can only view your own prescriptions', code: 'FORBIDDEN' });
      }

      if (userRole === 'patient' && prescription.patient_id !== userId) {
        return res.status(403).json({ success: false, message: 'You can only view your own prescriptions', code: 'FORBIDDEN' });
      }

      res.status(200).json({ success: true, message: 'Prescription retrieved successfully', data: prescription });
    });
  }

  static getAll(req, res) {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'doctor') {
      Prescription.getAllByDoctorId(userId, function(err, prescriptions) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
        }
        res.status(200).json({ success: true, message: 'Prescriptions retrieved successfully', data: prescriptions, count: prescriptions.length });
      });
    } else if (userRole === 'patient') {
      Prescription.getAllByPatientId(userId, function(err, prescriptions) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
        }
        res.status(200).json({ success: true, message: 'Prescriptions retrieved successfully', data: prescriptions, count: prescriptions.length });
      });
    }
  }

  static update(req, res) {
    const id = req.params.id;
    const userId = req.user.id;
    const { medication_name, dosage, frequency, duration, instructions, notes, status } = req.body;

    Prescription.findById(id, function(err, prescription) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
      }

      if (!prescription) {
        return res.status(404).json({ success: false, message: 'Prescription not found', code: 'NOT_FOUND' });
      }

      if (prescription.doctor_id !== userId) {
        return res.status(403).json({ success: false, message: 'You can only update your own prescriptions', code: 'FORBIDDEN' });
      }

      Prescription.update(id, { medication_name, dosage, frequency, duration, instructions, notes, status }, function(err, updatedPrescription) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error updating prescription', code: 'UPDATE_ERROR' });
        }
        res.status(200).json({ success: true, message: 'Prescription updated successfully', data: updatedPrescription });
      });
    });
  }

  static delete(req, res) {
    const id = req.params.id;
    const userId = req.user.id;

    Prescription.findById(id, function(err, prescription) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
      }

      if (!prescription) {
        return res.status(404).json({ success: false, message: 'Prescription not found', code: 'NOT_FOUND' });
      }

      if (prescription.doctor_id !== userId) {
        return res.status(403).json({ success: false, message: 'You can only delete your own prescriptions', code: 'FORBIDDEN' });
      }

      Prescription.delete(id, function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error deleting prescription', code: 'DELETE_ERROR' });
        }
        res.status(200).json({ success: true, message: 'Prescription deleted successfully' });
      });
    });
  }

  static getAllPrescriptions(req, res) {
    Prescription.getAll(function(err, prescriptions) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
      }
      res.status(200).json({ success: true, message: 'All prescriptions retrieved successfully', data: prescriptions, count: prescriptions.length });
    });
  }
}

module.exports = PrescriptionController;

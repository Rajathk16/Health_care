const db = require('../config/database');

class Prescription {
  static create(prescriptionData, callback) {
    const {
      doctor_id,
      patient_id,
      medication_name,
      dosage,
      frequency,
      duration,
      instructions,
      notes
    } = prescriptionData;

    const query = `
      INSERT INTO prescriptions (doctor_id, patient_id, medication_name, dosage, frequency, duration, instructions, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [doctor_id, patient_id, medication_name, dosage, frequency, duration, instructions || null, notes || null],
      function (err) {
        if (err) return callback(err);
        Prescription.findById(this.lastID, callback);
      }
    );
  }

  static findById(id, callback) {
    const query = `
      SELECT 
        p.id,
        p.doctor_id,
        p.patient_id,
        p.medication_name,
        p.dosage,
        p.frequency,
        p.duration,
        p.instructions,
        p.notes,
        p.status,
        p.created_at,
        p.updated_at,
        d.first_name as doctor_first_name,
        d.last_name as doctor_last_name,
        pa.first_name as patient_first_name,
        pa.last_name as patient_last_name
      FROM prescriptions p
      JOIN users d ON p.doctor_id = d.id
      JOIN users pa ON p.patient_id = pa.id
      WHERE p.id = ?
    `;
    db.get(query, [id], callback);
  }

  static getAllByDoctorId(doctorId, callback) {
    const query = `
      SELECT 
        p.id,
        p.doctor_id,
        p.patient_id,
        p.medication_name,
        p.dosage,
        p.frequency,
        p.duration,
        p.instructions,
        p.notes,
        p.status,
        p.created_at,
        p.updated_at,
        d.first_name as doctor_first_name,
        d.last_name as doctor_last_name,
        pa.first_name as patient_first_name,
        pa.last_name as patient_last_name
      FROM prescriptions p
      JOIN users d ON p.doctor_id = d.id
      JOIN users pa ON p.patient_id = pa.id
      WHERE p.doctor_id = ?
      ORDER BY p.created_at DESC
    `;
    db.all(query, [doctorId], callback);
  }

  static getAllByPatientId(patientId, callback) {
    const query = `
      SELECT 
        p.id,
        p.doctor_id,
        p.patient_id,
        p.medication_name,
        p.dosage,
        p.frequency,
        p.duration,
        p.instructions,
        p.notes,
        p.status,
        p.created_at,
        p.updated_at,
        d.first_name as doctor_first_name,
        d.last_name as doctor_last_name,
        pa.first_name as patient_first_name,
        pa.last_name as patient_last_name
      FROM prescriptions p
      JOIN users d ON p.doctor_id = d.id
      JOIN users pa ON p.patient_id = pa.id
      WHERE p.patient_id = ?
      ORDER BY p.created_at DESC
    `;
    db.all(query, [patientId], callback);
  }

  static update(id, prescriptionData, callback) {
    const {
      medication_name,
      dosage,
      frequency,
      duration,
      instructions,
      notes,
      status
    } = prescriptionData;

    const query = `
      UPDATE prescriptions
      SET medication_name = ?, dosage = ?, frequency = ?, duration = ?, instructions = ?, notes = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(
      query,
      [medication_name, dosage, frequency, duration, instructions || null, notes || null, status, id],
      function (err) {
        if (err) return callback(err);
        Prescription.findById(id, callback);
      }
    );
  }

  static delete(id, callback) {
    const query = 'DELETE FROM prescriptions WHERE id = ?';
    db.run(query, [id], callback);
  }

  static getAll(callback) {
    const query = `
      SELECT 
        p.id,
        p.doctor_id,
        p.patient_id,
        p.medication_name,
        p.dosage,
        p.frequency,
        p.duration,
        p.instructions,
        p.notes,
        p.status,
        p.created_at,
        p.updated_at,
        d.first_name as doctor_first_name,
        d.last_name as doctor_last_name,
        pa.first_name as patient_first_name,
        pa.last_name as patient_last_name
      FROM prescriptions p
      JOIN users d ON p.doctor_id = d.id
      JOIN users pa ON p.patient_id = pa.id
      ORDER BY p.created_at DESC
    `;
    db.all(query, [], callback);
  }
}

module.exports = Prescription;

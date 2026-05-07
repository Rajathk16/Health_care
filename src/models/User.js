const db = require('../config/database');

class User {
  static create(userData, callback) {
    const { username, email, password, role, first_name, last_name, specialization, license_number } = userData;

    const query = 'INSERT INTO users (username, email, password, role, first_name, last_name, specialization, license_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    db.run(query, [username, email, password, role, first_name, last_name, specialization || null, license_number || null], function(err) {
      if (err) return callback(err);
      callback(null, { id: this.lastID, username, email, role, first_name, last_name, specialization, license_number });
    });
  }

  static findByUsername(username, callback) {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.get(query, [username], callback);
  }

  static findByEmail(email, callback) {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], callback);
  }

  static findById(id, callback) {
    const query = 'SELECT id, username, email, role, first_name, last_name, specialization, license_number, is_active, created_at FROM users WHERE id = ?';
    db.get(query, [id], callback);
  }

  static getAllDoctors(callback) {
    const query = 'SELECT id, username, email, first_name, last_name, specialization, license_number FROM users WHERE role = ? AND is_active = 1';
    db.all(query, ['doctor'], callback);
  }

  static verifyPassword(plainPassword, storedPassword, callback) {
    const isMatch = plainPassword === storedPassword;
    callback(null, isMatch);
  }

  static update(id, userData, callback) {
    const { first_name, last_name, email, specialization, license_number } = userData;

    const query = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, specialization = ?, license_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';

    db.run(query, [first_name, last_name, email, specialization, license_number, id], function(err) {
      if (err) return callback(err);
      User.findById(id, callback);
    });
  }

  static getPatientsByDoctorId(doctorId, callback) {
    const query = 'SELECT DISTINCT u.id, u.username, u.email, u.first_name, u.last_name FROM users u INNER JOIN prescriptions p ON u.id = p.patient_id WHERE p.doctor_id = ? AND u.role = \'patient\' ORDER BY u.first_name, u.last_name';
    db.all(query, [doctorId], callback);
  }
}

module.exports = User;

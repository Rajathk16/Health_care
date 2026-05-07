const User = require('../models/User');
const jwt = require('jsonwebtoken');

class UserController {
  static register(req, res) {
    const { username, email, password, confirmPassword, role, first_name, last_name, specialization, license_number } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match', code: 'PASSWORD_MISMATCH' });
    }

    User.findByUsername(username, function(err, user) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
      }

      if (user) {
        return res.status(409).json({ success: false, message: 'Username already exists', code: 'USERNAME_EXISTS' });
      }

      User.findByEmail(email, function(err, user) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
        }

        if (user) {
          return res.status(409).json({ success: false, message: 'Email already exists', code: 'EMAIL_EXISTS' });
        }

        User.create({ username, email, password, role, first_name, last_name, specialization, license_number }, function(err, newUser) {
          if (err) {
            return res.status(500).json({ success: false, message: 'Error creating user', code: 'CREATE_ERROR' });
          }
          res.status(201).json({ success: true, message: 'User registered successfully', data: newUser });
        });
      });
    });
  }

  static login(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required', code: 'MISSING_CREDENTIALS' });
    }

    User.findByUsername(username, function(err, user) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid username or password', code: 'INVALID_CREDENTIALS' });
      }

      User.verifyPassword(password, user.password, function(err, isMatch) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error verifying password', code: 'VERIFY_ERROR' });
        }

        if (!isMatch) {
          return res.status(401).json({ success: false, message: 'Invalid username or password', code: 'INVALID_CREDENTIALS' });
        }

        if (!user.is_active) {
          return res.status(403).json({ success: false, message: 'User account is inactive', code: 'USER_INACTIVE' });
        }

        const token = jwt.sign(
          { id: user.id, username: user.username, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.status(200).json({
          success: true,
          message: 'Login successful',
          token: token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name
          }
        });
      });
    });
  }

  static getProfile(req, res) {
    const userId = req.user.id;

    User.findById(userId, function(err, user) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
      }

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found', code: 'NOT_FOUND' });
      }

      res.status(200).json({ success: true, message: 'Profile retrieved successfully', data: user });
    });
  }

  static updateProfile(req, res) {
    const userId = req.user.id;
    const { first_name, last_name, email, specialization, license_number } = req.body;

    User.update(userId, { first_name, last_name, email, specialization, license_number }, function(err, updatedUser) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error updating profile', code: 'UPDATE_ERROR' });
      }
      res.status(200).json({ success: true, message: 'Profile updated successfully', data: updatedUser });
    });
  }

  static getAllDoctors(req, res) {
    User.getAllDoctors(function(err, doctors) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
      }
      res.status(200).json({ success: true, message: 'Doctors retrieved successfully', data: doctors, count: doctors.length });
    });
  }

  static getPatientsByDoctorId(req, res) {
    const doctorId = req.user.id;

    User.getPatientsByDoctorId(doctorId, function(err, patients) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Database error', code: 'DB_ERROR' });
      }
      res.status(200).json({ success: true, message: 'Patients retrieved successfully', data: patients, count: patients.length });
    });
  }
}

module.exports = UserController;

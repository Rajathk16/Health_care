INSERT INTO users (username, email, password, role, first_name, last_name, specialization, license_number, is_active)
VALUES (
  'doctor1',
  'doctor1@healthtech.com',
  '$2b$10$YourBcryptHashedPasswordHere',
  'doctor',
  'John',
  'Smith',
  'Cardiology',
  'LIC-2024-001',
  1
);

INSERT INTO users (username, email, password, role, first_name, last_name, is_active)
VALUES (
  'patient1',
  'patient1@healthtech.com',
  '$2b$10$YourBcryptHashedPasswordHere',
  'patient',
  'Jane',
  'Doe',
  1
);

SELECT id, username, email, password, role, first_name, last_name, is_active
FROM users
WHERE username = 'doctor1';

SELECT id, username, email, password, role, first_name, last_name, is_active
FROM users
WHERE email = 'doctor1@healthtech.com';

SELECT id, username, email, role, first_name, last_name, specialization, license_number, is_active, created_at
FROM users
WHERE id = 1;

SELECT id, username, email, first_name, last_name, specialization, license_number
FROM users
WHERE role = 'doctor' AND is_active = 1
ORDER BY first_name, last_name;

SELECT id, username, email, first_name, last_name
FROM users
WHERE role = 'patient' AND is_active = 1
ORDER BY first_name, last_name;

SELECT DISTINCT u.id, u.username, u.email, u.first_name, u.last_name
FROM users u
INNER JOIN prescriptions p ON u.id = p.patient_id
WHERE p.doctor_id = 1 AND u.role = 'patient'
ORDER BY u.first_name, u.last_name;

UPDATE users
SET first_name = 'Jonathan', email = 'jonathan.smith@healthtech.com', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

UPDATE users
SET is_active = 0, updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

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
WHERE p.doctor_id = 1
ORDER BY p.created_at DESC;

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
WHERE p.patient_id = 2
ORDER BY p.created_at DESC;

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
  d.specialization,
  pa.first_name as patient_first_name,
  pa.last_name as patient_last_name
FROM prescriptions p
JOIN users d ON p.doctor_id = d.id
JOIN users pa ON p.patient_id = pa.id
WHERE p.id = 1;

SELECT 
  p.id,
  p.medication_name,
  p.dosage,
  p.frequency,
  p.duration,
  p.instructions,
  d.first_name as doctor_first_name,
  d.last_name as doctor_last_name
FROM prescriptions p
JOIN users d ON p.doctor_id = d.id
WHERE p.patient_id = 2 AND p.status = 'active'
ORDER BY p.created_at DESC;

SELECT 
  p.id,
  p.medication_name,
  p.dosage,
  p.frequency,
  p.duration,
  p.status,
  p.created_at,
  d.first_name as doctor_first_name,
  d.last_name as doctor_last_name,
  pa.first_name as patient_first_name,
  pa.last_name as patient_last_name
FROM prescriptions p
JOIN users d ON p.doctor_id = d.id
JOIN users pa ON p.patient_id = pa.id
ORDER BY p.created_at DESC;

SELECT 
  u.id,
  u.first_name,
  u.last_name,
  COUNT(p.id) as total_prescriptions
FROM users u
LEFT JOIN prescriptions p ON u.id = p.doctor_id
WHERE u.role = 'doctor'
GROUP BY u.id
ORDER BY total_prescriptions DESC;

SELECT 
  p.id,
  p.medication_name,
  p.status,
  p.created_at,
  d.first_name as doctor_name,
  pa.first_name as patient_name
FROM prescriptions p
JOIN users d ON p.doctor_id = d.id
JOIN users pa ON p.patient_id = pa.id
WHERE p.status = 'active'
ORDER BY p.created_at DESC;

UPDATE prescriptions
SET medication_name = 'Aspirin 100mg', dosage = '100mg', frequency = 'Once daily', updated_at = CURRENT_TIMESTAMP
WHERE id = 1 AND doctor_id = 1;

UPDATE prescriptions
SET status = 'completed', updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

DELETE FROM prescriptions
WHERE id = 1 AND doctor_id = 1;

SELECT id, action, entity_type, entity_id, created_at
FROM audit_logs
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 20;

SELECT id, user_id, action, created_at
FROM audit_logs
WHERE action = 'LOGIN'
ORDER BY created_at DESC;

SELECT 
  al.id,
  al.user_id,
  al.action,
  al.entity_id,
  al.old_values,
  al.new_values,
  al.created_at,
  u.first_name,
  u.last_name
FROM audit_logs al
JOIN users u ON al.user_id = u.id
WHERE al.entity_type = 'PRESCRIPTION'
ORDER BY al.created_at DESC;

SELECT 
  COUNT(*) as total_prescriptions,
  SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_prescriptions,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_prescriptions,
  SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_prescriptions
FROM prescriptions;

SELECT 
  COUNT(CASE WHEN role = 'doctor' THEN 1 END) as total_doctors,
  COUNT(CASE WHEN role = 'patient' THEN 1 END) as total_patients,
  COUNT(CASE WHEN role = 'doctor' AND is_active = 1 THEN 1 END) as active_doctors,
  COUNT(CASE WHEN role = 'patient' AND is_active = 1 THEN 1 END) as active_patients
FROM users;

SELECT 
  medication_name,
  COUNT(*) as prescription_count
FROM prescriptions
GROUP BY medication_name
ORDER BY prescription_count DESC;

SELECT 
  u.id,
  u.first_name,
  u.last_name,
  COUNT(p.id) as prescriptions_issued
FROM users u
LEFT JOIN prescriptions p ON u.id = p.doctor_id
WHERE u.role = 'doctor'
GROUP BY u.id
ORDER BY prescriptions_issued DESC;

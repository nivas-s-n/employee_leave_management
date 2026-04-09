-- Create database
CREATE DATABASE IF NOT EXISTS leave_management;
USE leave_management;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('employee','manager','admin') DEFAULT 'employee',
    dept VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave types table
CREATE TABLE leave_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL,
    max_days_per_year INT NOT NULL
);

-- Leave requests table
CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    reason TEXT,
    status ENUM('pending','approved','rejected','cancelled') DEFAULT 'pending',
    approved_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- Leave balances table
CREATE TABLE leave_balances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    leave_type_id INT NOT NULL,
    year YEAR NOT NULL,
    total_days INT NOT NULL,
    used_days INT DEFAULT 0,
    FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
    UNIQUE KEY unique_balance (employee_id, leave_type_id, year)
);

-- sample leave types
INSERT INTO leave_types (type_name, max_days_per_year) VALUES 
('Casual Leave', 12),
('Sick Leave', 10),
('Earned Leave', 15);

INSERT INTO users (name, email, password_hash, role, dept) VALUES
('User Employee', 'employee@test.com', '$2a$10$NBSgpLGVjnoFo9qyS1Hx7.Ae.SQx/PT7WDSoxs8keArG7rR4cKgQ.', 'employee', 'IT'),
('User Manager', 'manager@test.com', '$2a$10$NBSgpLGVjnoFo9qyS1Hx7.Ae.SQx/PT7WDSoxs8keArG7rR4cKgQ.', 'manager', 'IT'),
('User Admin', 'admin@test.com', '$2a$10$NBSgpLGVjnoFo9qyS1Hx7.Ae.SQx/PT7WDSoxs8keArG7rR4cKgQ.', 'admin', 'Management');

-- Sample data
INSERT INTO leave_balances (employee_id, leave_type_id, year, total_days, used_days) VALUES
(1, 1, 2025, 12, 0),
(1, 2, 2025, 10, 0),
(1, 3, 2025, 15, 0);
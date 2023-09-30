-- Drop the database if it already exists
DROP DATABASE IF EXISTS teamorg_db;

-- Create the database
CREATE DATABASE teamorg_db;

-- Use the newly created database
USE teamorg_db;

-- Create the Departments table
CREATE TABLE Departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(255) NOT NULL
);

-- Create the Roles table with department_id as a foreign key
CREATE TABLE Roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    job_title VARCHAR(255) NOT NULL,
    salary DECIMAL(10, 2),
    department_id INT,  
    FOREIGN KEY (department_id) REFERENCES Departments(department_id),  
);

-- Create the Employees table
CREATE TABLE Employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id),
    FOREIGN KEY (manager_id) REFERENCES Employees(employee_id)
);

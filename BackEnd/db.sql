-- MySQL
CREATE DATABASE community_garden;
USE community_garden;

-- Users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
);

-- Garden plots
CREATE TABLE plots (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    status ENUM('AVAILABLE', 'OCCUPIED') DEFAULT 'AVAILABLE',
    size VARCHAR(20),
    location VARCHAR(100)
);

-- Plantings
CREATE TABLE plantings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    plot_id BIGINT,
    user_id BIGINT,
    plant_name VARCHAR(100) NOT NULL,
    planting_date DATE,
    harvest_date DATE,
    FOREIGN KEY (plot_id) REFERENCES plots(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tasks
CREATE TABLE tasks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATE,
    status ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'PENDING',
    assigned_to BIGINT,
    created_by BIGINT,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Harvests
CREATE TABLE harvests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    planting_id BIGINT,
    quantity DECIMAL(5,2),
    harvest_date DATE,
    harvested_by BIGINT,
    notes TEXT,
    FOREIGN KEY (planting_id) REFERENCES plantings(id),
    FOREIGN KEY (harvested_by) REFERENCES users(id)
);
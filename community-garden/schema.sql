-- ============================================================
-- Community Garden Management System - MySQL Schema
-- ============================================================

-- Create and use database
CREATE DATABASE IF NOT EXISTS community_garden_db;
USE community_garden_db;

-- ─── Users ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100)  NOT NULL,
    email         VARCHAR(150)  NOT NULL UNIQUE,
    password      VARCHAR(255)  NOT NULL,
    role          ENUM('ADMIN', 'MEMBER') NOT NULL DEFAULT 'MEMBER'
);

-- ─── Garden Plots ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS garden_plots (
    id               BIGINT AUTO_INCREMENT PRIMARY KEY,
    plot_number      VARCHAR(50)  NOT NULL UNIQUE,
    size             VARCHAR(50)  NOT NULL,
    status           ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
    assigned_user_id BIGINT,
    CONSTRAINT fk_plot_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ─── Plants ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plants (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    plant_name     VARCHAR(100)  NOT NULL,
    category       VARCHAR(100)  NOT NULL,
    planting_date  DATE          NOT NULL,
    harvest_date   DATE,
    growth_status  ENUM('SEEDLING', 'GROWING', 'MATURE', 'HARVESTED', 'DEAD') NOT NULL DEFAULT 'SEEDLING',
    plot_id        BIGINT        NOT NULL,
    CONSTRAINT fk_plant_plot FOREIGN KEY (plot_id) REFERENCES garden_plots(id) ON DELETE CASCADE
);

-- ─── Watering Schedules ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS watering_schedules (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    watering_date  DATE          NOT NULL,
    watering_time  TIME          NOT NULL,
    status         ENUM('SCHEDULED', 'COMPLETED', 'SKIPPED') NOT NULL DEFAULT 'SCHEDULED',
    notes          VARCHAR(500),
    plot_id        BIGINT        NOT NULL,
    CONSTRAINT fk_watering_plot FOREIGN KEY (plot_id) REFERENCES garden_plots(id) ON DELETE CASCADE
);

-- ─── Events ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_name   VARCHAR(200)  NOT NULL,
    description  TEXT,
    event_date   DATETIME      NOT NULL,
    location     VARCHAR(300)  NOT NULL
);

-- ============================================================
-- SEED DATA
-- ============================================================

-- Seed: Users
-- Passwords are BCrypt encoded:
--   admin123  -> $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
--   member123 -> $2a$10$GRunJMR6p/07oVQf5aBbdOVPNfJcXmVqFXcMXNHbME.9PGUoT.0Ry

INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin User',   'admin@garden.com',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN'),
('Alice Green',  'alice@garden.com',  '$2a$10$GRunJMR6p/07oVQf5aBbdOVPNfJcXmVqFXcMXNHbME.9PGUoT.0Ry', 'MEMBER'),
('Bob Sprout',   'bob@garden.com',    '$2a$10$GRunJMR6p/07oVQf5aBbdOVPNfJcXmVqFXcMXNHbME.9PGUoT.0Ry', 'MEMBER'),
('Carol Bloom',  'carol@garden.com',  '$2a$10$GRunJMR6p/07oVQf5aBbdOVPNfJcXmVqFXcMXNHbME.9PGUoT.0Ry', 'MEMBER');

-- Seed: Garden Plots
INSERT IGNORE INTO garden_plots (plot_number, size, status, assigned_user_id) VALUES
('A-01', '10x10', 'OCCUPIED',    2),
('A-02', '10x10', 'OCCUPIED',    3),
('A-03', '5x10',  'AVAILABLE',   NULL),
('B-01', '10x10', 'MAINTENANCE', NULL),
('B-02', '5x5',   'AVAILABLE',   NULL),
('B-03', '10x10', 'OCCUPIED',    4);

-- Seed: Plants
INSERT IGNORE INTO plants (plant_name, category, planting_date, harvest_date, growth_status, plot_id) VALUES
('Tomato',     'Vegetable', '2025-03-01', '2025-06-01', 'GROWING',   1),
('Basil',      'Herb',      '2025-03-10', NULL,         'SEEDLING',  1),
('Cucumber',   'Vegetable', '2025-03-05', '2025-06-15', 'GROWING',   2),
('Sunflower',  'Flower',    '2025-03-15', NULL,         'SEEDLING',  2),
('Strawberry', 'Fruit',     '2025-02-20', '2025-05-20', 'MATURE',    6),
('Mint',       'Herb',      '2025-03-01', NULL,         'GROWING',   6);

-- Seed: Watering Schedules
INSERT IGNORE INTO watering_schedules (watering_date, watering_time, status, notes, plot_id) VALUES
('2025-05-01', '07:00:00', 'COMPLETED', 'Morning watering done',       1),
('2025-05-03', '07:00:00', 'COMPLETED', NULL,                           1),
('2025-05-05', '07:00:00', 'SCHEDULED', 'Check soil moisture first',   1),
('2025-05-02', '08:00:00', 'COMPLETED', NULL,                           2),
('2025-05-05', '08:00:00', 'SCHEDULED', NULL,                           2),
('2025-05-06', '07:30:00', 'SCHEDULED', 'Use drip system',             6);

-- Seed: Events
INSERT IGNORE INTO events (event_name, description, event_date, location) VALUES
('Spring Planting Workshop',     'Learn best practices for spring planting',          '2025-04-15 09:00:00', 'Main Garden Hall'),
('Community Harvest Day',        'Celebrate and share the season harvest with all',   '2025-06-20 10:00:00', 'Garden Square'),
('Composting 101',               'Introduction to composting techniques',             '2025-05-10 14:00:00', 'Plot B Area'),
('Water Conservation Seminar',   'Tips for efficient garden watering',                '2025-07-05 11:00:00', 'Community Center'),
('Kids Gardening Day',           'Fun gardening activities for children',             '2025-08-12 09:30:00', 'Main Garden Hall');

-- =====================================================
-- PitchLense Database Setup Script for GCP Cloud SQL
-- =====================================================
-- Run these commands in your GCP Cloud SQL MySQL instance
-- Make sure you're connected to the 'pitchlense' database

-- =====================================================
-- 1. CREATE DATABASE (if it doesn't exist)
-- =====================================================
CREATE DATABASE IF NOT EXISTS pitchlense;
USE pitchlense;

-- =====================================================
-- 2. CREATE USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS pitchlense.users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. CREATE REPORTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS pitchlense.reports (
    report_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    report_name VARCHAR(255) NOT NULL,
    startup_name VARCHAR(255) NOT NULL,
    founder_name VARCHAR(255) NOT NULL,
    launch_date VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    is_delete TINYINT(1) NOT NULL DEFAULT 0,
    is_pinned TINYINT(1) NOT NULL DEFAULT 0,
    report_path TEXT,
    total_files INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reports_user FOREIGN KEY (user_id) REFERENCES pitchlense.users(id) ON DELETE CASCADE
);

-- =====================================================
-- 4. CREATE UPLOADS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS pitchlense.uploads (
    file_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    report_id VARCHAR(255) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_format VARCHAR(100) NOT NULL,
    upload_path TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_upload_report FOREIGN KEY (report_id) REFERENCES pitchlense.reports(report_id) ON DELETE CASCADE
);

-- =====================================================
-- 5. CREATE CHATS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS pitchlense.chats (
    chat_id VARCHAR(255) PRIMARY KEY,
    report_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    user_message TEXT NOT NULL,
    ai_response TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_chat_report FOREIGN KEY (report_id) REFERENCES pitchlense.reports(report_id) ON DELETE CASCADE
);

-- =====================================================
-- 6. CREATE INDEXES
-- =====================================================

-- Reports table indexes
CREATE INDEX idx_reports_report_name ON pitchlense.reports(report_name);
CREATE INDEX idx_reports_user_id ON pitchlense.reports(user_id);

-- Uploads table indexes
CREATE INDEX idx_uploads_report_id ON pitchlense.uploads(report_id);

-- Chats table indexes
CREATE INDEX idx_chats_report_id ON pitchlense.chats(report_id);
CREATE INDEX idx_chats_user_id ON pitchlense.chats(user_id);

-- =====================================================
-- 7. VERIFY TABLES CREATED
-- =====================================================
SHOW TABLES;

-- =====================================================
-- 8. CHECK TABLE STRUCTURES
-- =====================================================
DESCRIBE pitchlense.users;
DESCRIBE pitchlense.reports;
DESCRIBE pitchlense.uploads;
DESCRIBE pitchlense.chats;

-- =====================================================
-- 9. CHECK INDEXES
-- =====================================================
SHOW INDEX FROM pitchlense.reports;
SHOW INDEX FROM pitchlense.uploads;
SHOW INDEX FROM pitchlense.chats;

-- =====================================================
-- 10. SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =====================================================
-- Uncomment these lines if you want to insert sample data for testing

/*
-- Insert a test user
INSERT INTO pitchlense.users (id, email, password_hash, name) 
VALUES ('test-user-123', 'test@example.com', 'hashed_password_here', 'Test User');

-- Insert a test report
INSERT INTO pitchlense.reports (report_id, user_id, report_name, startup_name, founder_name, launch_date, status, is_delete, is_pinned, report_path, total_files) 
VALUES ('test-report-123', 'test-user-123', 'Test Report', 'Test Startup', 'Test Founder', '2024-01-01', 'pending', 0, 0, NULL, 0);
*/

-- =====================================================
-- 11. CLEANUP COMMANDS (if needed)
-- =====================================================
-- Uncomment these lines if you need to drop tables and start over

/*
-- Drop tables in reverse order (due to foreign key constraints)
DROP TABLE IF EXISTS pitchlense.chats;
DROP TABLE IF EXISTS pitchlense.uploads;
DROP TABLE IF EXISTS pitchlense.reports;
DROP TABLE IF EXISTS pitchlense.users;

-- Drop database (if needed)
DROP DATABASE IF EXISTS pitchlense;
*/

-- =====================================================
-- END OF SCRIPT
-- =====================================================

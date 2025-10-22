-- PitchLense Database Schema
-- Complete database setup for PitchLense application
-- This script creates all required tables for the application

-- Use the pitchlense database
-- Make sure to create the database first if it doesn't exist:
-- CREATE DATABASE IF NOT EXISTS pitchlense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE pitchlense;

-- ============================================
-- Table: users
-- Stores user authentication and profile data
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: reports
-- Stores startup analysis reports
-- ============================================
CREATE TABLE IF NOT EXISTS reports (
  report_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  report_name VARCHAR(255) NOT NULL,
  startup_name VARCHAR(255) NOT NULL,
  founder_name VARCHAR(255),
  launch_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  is_delete TINYINT(1) DEFAULT 0,
  is_pinned TINYINT(1) DEFAULT 0,
  report_path TEXT,
  total_files INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_startup_name (startup_name),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  INDEX idx_is_delete (is_delete),
  INDEX idx_is_pinned (is_pinned),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: uploads
-- Stores file uploads associated with reports
-- ============================================
CREATE TABLE IF NOT EXISTS uploads (
  file_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  report_id VARCHAR(36) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_format VARCHAR(100),
  upload_path TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_report_id (report_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: chats
-- Stores Q&A chat history for reports
-- ============================================
CREATE TABLE IF NOT EXISTS chats (
  chat_id VARCHAR(36) PRIMARY KEY,
  report_id VARCHAR(36) NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  confidence_score INT DEFAULT 100,
  warnings TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_report_id (report_id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (report_id) REFERENCES reports(report_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: investments
-- Stores investment tracking data
-- ============================================
CREATE TABLE IF NOT EXISTS investments (
  investment_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  startup_name VARCHAR(255) NOT NULL,
  investor_name VARCHAR(255),
  funding_round VARCHAR(50),
  investment_amount DECIMAL(20, 2) NOT NULL,
  equity_percentage DECIMAL(5, 2),
  company_valuation DECIMAL(20, 2),
  investment_date DATE NOT NULL,
  investment_type VARCHAR(50) DEFAULT 'Equity',
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Active',
  is_deleted TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_startup_name (startup_name),
  INDEX idx_investment_date (investment_date),
  INDEX idx_status (status),
  INDEX idx_is_deleted (is_deleted),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: investment_updates
-- Stores updates and changes to investments
-- ============================================
CREATE TABLE IF NOT EXISTS investment_updates (
  update_id VARCHAR(36) PRIMARY KEY,
  investment_id VARCHAR(36) NOT NULL,
  update_type VARCHAR(100) NOT NULL,
  additional_amount DECIMAL(20, 2),
  new_equity_percentage DECIMAL(5, 2),
  new_valuation DECIMAL(20, 2),
  roi_percentage DECIMAL(10, 2),
  notes TEXT,
  update_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_investment_id (investment_id),
  INDEX idx_update_date (update_date),
  INDEX idx_update_type (update_type),
  FOREIGN KEY (investment_id) REFERENCES investments(investment_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- View: investment_summary
-- Provides calculated metrics for investments
-- ============================================
CREATE OR REPLACE VIEW investment_summary AS
SELECT 
  i.investment_id,
  i.user_id,
  i.startup_name,
  i.investor_name,
  i.funding_round,
  i.investment_amount,
  i.equity_percentage,
  i.company_valuation,
  i.investment_date,
  i.investment_type,
  i.status,
  i.created_at,
  i.updated_at,
  -- Calculate total additional investment
  COALESCE(SUM(u.additional_amount), 0) as total_additional_investment,
  -- Get latest valuation
  COALESCE(
    (SELECT new_valuation 
     FROM investment_updates 
     WHERE investment_id = i.investment_id 
       AND new_valuation IS NOT NULL 
     ORDER BY update_date DESC 
     LIMIT 1),
    i.company_valuation
  ) as current_valuation,
  -- Get latest equity percentage
  COALESCE(
    (SELECT new_equity_percentage 
     FROM investment_updates 
     WHERE investment_id = i.investment_id 
       AND new_equity_percentage IS NOT NULL 
     ORDER BY update_date DESC 
     LIMIT 1),
    i.equity_percentage
  ) as current_equity_percentage,
  -- Count total updates
  COUNT(u.update_id) as total_updates
FROM investments i
LEFT JOIN investment_updates u ON i.investment_id = u.investment_id
WHERE i.is_deleted = 0
GROUP BY 
  i.investment_id,
  i.user_id,
  i.startup_name,
  i.investor_name,
  i.funding_round,
  i.investment_amount,
  i.equity_percentage,
  i.company_valuation,
  i.investment_date,
  i.investment_type,
  i.status,
  i.created_at,
  i.updated_at;

-- ============================================
-- Verification Queries
-- Run these to verify all tables were created successfully
-- ============================================

-- Check all tables exist
SHOW TABLES;

-- Verify table structures
DESCRIBE users;
DESCRIBE reports;
DESCRIBE uploads;
DESCRIBE chats;
DESCRIBE investments;
DESCRIBE investment_updates;

-- Check view
SHOW CREATE VIEW investment_summary;

-- ============================================
-- Sample Queries for Testing
-- ============================================

-- Count records in each table
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'reports', COUNT(*) FROM reports
UNION ALL
SELECT 'uploads', COUNT(*) FROM uploads
UNION ALL
SELECT 'chats', COUNT(*) FROM chats
UNION ALL
SELECT 'investments', COUNT(*) FROM investments
UNION ALL
SELECT 'investment_updates', COUNT(*) FROM investment_updates;

-- ============================================
-- Notes:
-- ============================================
-- 1. All tables use VARCHAR(36) for UUIDs (compatible with crypto.randomUUID())
-- 2. All tables use utf8mb4 charset for full Unicode support
-- 3. Foreign keys are set up with CASCADE DELETE for data integrity
-- 4. Indexes are added for commonly queried columns for performance
-- 5. Timestamps use CURRENT_TIMESTAMP and ON UPDATE CURRENT_TIMESTAMP
-- 6. The investment_summary view provides calculated metrics without duplicating data
-- 7. DECIMAL(20, 2) supports values up to 999,999,999,999,999,999.99 (999 quadrillion)


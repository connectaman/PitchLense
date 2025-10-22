-- Investment Tracking Schema for PitchLense
-- Run this SQL script in your GCP SQL database to create the required tables

-- First, check the data type of users.id to ensure compatibility
-- Run this query first to check: DESCRIBE pitchlense.users;
-- Then adjust user_id type below to match the id column type from users table

-- Create investments table
CREATE TABLE IF NOT EXISTS pitchlense.investments (
  investment_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,  -- Changed to VARCHAR(255) to match common user id format
  startup_name VARCHAR(255) NOT NULL,
  investor_name VARCHAR(255),
  funding_round VARCHAR(50),
  investment_amount DECIMAL(20, 2) NOT NULL,  -- Increased to support up to 999 quadrillion
  equity_percentage DECIMAL(5, 2),
  company_valuation DECIMAL(20, 2),  -- Increased to support large valuations
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
  INDEX idx_status (status)
  -- Foreign key constraint removed - add manually after verifying users.id type
  -- FOREIGN KEY (user_id) REFERENCES pitchlense.users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create investment_updates table for tracking changes/additional rounds
CREATE TABLE IF NOT EXISTS pitchlense.investment_updates (
  update_id VARCHAR(36) PRIMARY KEY,
  investment_id VARCHAR(36) NOT NULL,
  update_type VARCHAR(100) NOT NULL,
  additional_amount DECIMAL(20, 2),  -- Increased to support large additional investments
  new_equity_percentage DECIMAL(5, 2),
  new_valuation DECIMAL(20, 2),  -- Increased to support large valuations (up to 999 quadrillion)
  roi_percentage DECIMAL(10, 2),  -- Increased to support very high ROI percentages
  notes TEXT,
  update_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_investment_id (investment_id),
  INDEX idx_update_date (update_date),
  INDEX idx_update_type (update_type)
  -- Foreign key will be added after investments table is created
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraint for investment_updates
-- This is done separately to avoid issues if the table already exists
ALTER TABLE pitchlense.investment_updates 
ADD CONSTRAINT fk_investment_updates_investment
FOREIGN KEY (investment_id) REFERENCES pitchlense.investments(investment_id) ON DELETE CASCADE;

-- Create view for investment summary with calculated metrics
CREATE OR REPLACE VIEW pitchlense.investment_summary AS
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
     FROM pitchlense.investment_updates 
     WHERE investment_id = i.investment_id 
       AND new_valuation IS NOT NULL 
     ORDER BY update_date DESC 
     LIMIT 1),
    i.company_valuation
  ) as current_valuation,
  -- Get latest equity percentage
  COALESCE(
    (SELECT new_equity_percentage 
     FROM pitchlense.investment_updates 
     WHERE investment_id = i.investment_id 
       AND new_equity_percentage IS NOT NULL 
     ORDER BY update_date DESC 
     LIMIT 1),
    i.equity_percentage
  ) as current_equity_percentage,
  -- Count total updates
  COUNT(u.update_id) as total_updates
FROM pitchlense.investments i
LEFT JOIN pitchlense.investment_updates u ON i.investment_id = u.investment_id
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


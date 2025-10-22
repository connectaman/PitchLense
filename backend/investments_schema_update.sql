-- Migration Script: Update Investment Tables to Support Larger Values
-- Run this if you've already created the tables with the old schema

-- Update investments table to support larger decimal values
ALTER TABLE pitchlense.investments
MODIFY COLUMN investment_amount DECIMAL(20, 2) NOT NULL,
MODIFY COLUMN company_valuation DECIMAL(20, 2);

-- Update investment_updates table to support larger decimal values
ALTER TABLE pitchlense.investment_updates
MODIFY COLUMN additional_amount DECIMAL(20, 2),
MODIFY COLUMN new_valuation DECIMAL(20, 2),
MODIFY COLUMN roi_percentage DECIMAL(10, 2);

-- Add guardrails columns to chats table (for LLM response validation)
ALTER TABLE pitchlense.chats
ADD COLUMN confidence_score INT DEFAULT 100,
ADD COLUMN warnings TEXT;

-- Verify the changes
DESCRIBE pitchlense.investments;
DESCRIBE pitchlense.investment_updates;
DESCRIBE pitchlense.chats;


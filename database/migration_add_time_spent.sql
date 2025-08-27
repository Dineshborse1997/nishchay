-- Migration to add time_spent column to existing results table
-- Run this if you already have a results table without the time_spent column

ALTER TABLE results 
ADD COLUMN time_spent INT DEFAULT 0 
AFTER percentage;

-- Update existing results to have a default time spent of 0
UPDATE results SET time_spent = 0 WHERE time_spent IS NULL;
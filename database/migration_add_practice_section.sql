-- Migration to add practice_section column to existing questions table
-- Run this if you already have a questions table without the practice_section column

ALTER TABLE questions 
ADD COLUMN practice_section ENUM('pyq', 'model_papers', 'district_papers', 'subject_wise') DEFAULT 'subject_wise' 
AFTER difficulty;

-- Update existing questions to have a default practice section
UPDATE questions SET practice_section = 'subject_wise' WHERE practice_section IS NULL;
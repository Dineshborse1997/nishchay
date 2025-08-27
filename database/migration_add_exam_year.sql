-- Migration to add exam_year column to existing questions table
ALTER TABLE questions 
ADD COLUMN exam_year INT DEFAULT NULL 
AFTER practice_section;
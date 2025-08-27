-- Create the users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  mobile VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  photo LONGTEXT,
  role ENUM('student', 'admin') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the exams table
CREATE TABLE exams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  exam_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the questions table
CREATE TABLE questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  exam_id INT,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer ENUM('a', 'b', 'c', 'd') NOT NULL,
  category ENUM('police_bharti', 'talathi_bharti', 'general') DEFAULT 'general',
  difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
  practice_section ENUM('pyq', 'model_papers', 'district_papers', 'subject_wise') DEFAULT 'subject_wise',
  exam_year INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id)
);

-- Create the notices table
CREATE TABLE notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Create the results table
CREATE TABLE results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  exam_id INT,
  score INT,
  total_questions INT,
  percentage DECIMAL(5,2),
  time_spent INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (exam_id) REFERENCES exams(id)
);

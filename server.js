import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import multer from 'multer';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Dinesh@123',
  database: 'prepwise',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection on startup
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please ensure MySQL is running and credentials are correct');
  }
}

testConnection();

app.post('/api/signup', async (req, res) => {
  try {
    const { fullName, email, mobile, password } = req.body;
    
    console.log('Signup attempt:', { fullName, email, mobile, password: '***' });
    
    // Check if user already exists
    const [existingUsers] = await pool.query(
      'SELECT email, mobile FROM users WHERE email = ? OR mobile = ?',
      [email, mobile]
    );
    
    if (existingUsers.length > 0) {
      const existing = existingUsers[0];
      if (existing.email === email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      if (existing.mobile === mobile) {
        return res.status(400).json({ error: 'Mobile number already registered' });
      }
    }
    
    const hashedPassword = password; // TODO: hash it

    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, mobile, password, role) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, mobile, hashedPassword, 'student']
    );
    
    console.log('User created successfully:', result.insertId);

    res.status(200).json({ message: 'Account created successfully' });
  } catch (error) {
    console.error("Signup error:", error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      if (error.message.includes('email')) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      if (error.message.includes('mobile')) {
        return res.status(400).json({ error: 'Mobile number already registered' });
      }
      return res.status(400).json({ error: 'Account already exists' });
    }
    
    res.status(500).json({ error: error.message || 'Failed to create account' });
  }
});

app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ? AND role = ?',
      [username, 'admin']
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = rows[0];
    // TODO: Validate password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    res.status(200).json({ 
      message: 'Admin login successful',
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ error: error.message || 'Failed to login' });
  }
});

app.post('/api/student/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    
    console.log('Login attempt:', { mobile, password: '***' });
    
    // First check if user exists
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE mobile = ? AND role = ?',
      [mobile, 'student']
    );

    console.log('Found users:', rows.length);

    if (rows.length === 0) {
      // Check if user exists with different role or mobile
      const [allUsers] = await pool.query(
        'SELECT mobile, role FROM users WHERE mobile = ?',
        [mobile]
      );
      
      if (allUsers.length > 0) {
        console.log('User exists but with different role:', allUsers[0].role);
        return res.status(401).json({ error: 'Account not found as student' });
      }
      
      return res.status(401).json({ error: 'Mobile number not registered' });
    }

    const user = rows[0];
    console.log('User found:', { id: user.id, mobile: user.mobile, storedPassword: user.password });
    
    // Validate password
    if (user.password !== password) {
      console.log('Password mismatch');
      return res.status(401).json({ error: 'Incorrect password' });
    }

    console.log('Login successful for user:', user.id);
    
    res.status(200).json({ 
      message: 'Student login successful',
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ error: error.message || 'Failed to login' });
  }
});

// Get user profile
app.get('/api/user/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(
      'SELECT id, full_name, email, mobile, photo, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Get user stats
app.get('/api/user/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get comprehensive stats
    const [results] = await pool.query(
      'SELECT COUNT(*) as testsTaken, AVG(percentage) as avgScore, MAX(percentage) as bestScore FROM results WHERE user_id = ?',
      [userId]
    );
    
    // Get weekly tests (last 7 days)
    const [weeklyResults] = await pool.query(
      'SELECT COUNT(*) as weeklyTests FROM results WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)',
      [userId]
    );
    
    // Get recent activity
    const [recentTests] = await pool.query(
      `SELECT r.id, r.score, r.total_questions, r.percentage, r.created_at, 
              COALESCE(e.title, 'Practice Quiz') as exam_title 
       FROM results r 
       LEFT JOIN exams e ON r.exam_id = e.id 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC LIMIT 5`,
      [userId]
    );

    const stats = {
      testsTaken: results[0]?.testsTaken || 0,
      averageScore: Math.round(results[0]?.avgScore || 0),
      bestScore: Math.round(results[0]?.bestScore || 0),
      hoursStudied: Math.floor((results[0]?.testsTaken || 0) * 0.75),
      weeklyTests: weeklyResults[0]?.weeklyTests || 0,
      recentActivity: recentTests
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get user stats by exam type
app.get('/api/user/stats/:userId/:examType', async (req, res) => {
  try {
    const { userId, examType } = req.params;
    const category = examType === 'police' ? 'police_bharti' : 'talathi_bharti';
    
    // Get comprehensive stats filtered by exam type
    // Since we don't have exam type in results table yet, return general stats for now
    const [results] = await pool.query(
      'SELECT COUNT(*) as testsTaken, AVG(percentage) as avgScore, MAX(percentage) as bestScore FROM results WHERE user_id = ?',
      [userId]
    );
    
    // Get weekly tests (last 7 days)
    const [weeklyResults] = await pool.query(
      'SELECT COUNT(*) as weeklyTests FROM results WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)',
      [userId]
    );
    
    // Get recent activity
    const [recentTests] = await pool.query(
      `SELECT r.id, r.score, r.total_questions, r.percentage, r.created_at, 
              COALESCE(e.title, 'Practice Quiz') as exam_title 
       FROM results r 
       LEFT JOIN exams e ON r.exam_id = e.id 
       WHERE r.user_id = ? 
       ORDER BY r.created_at DESC LIMIT 5`,
      [userId]
    );

    const stats = {
      testsTaken: results[0]?.testsTaken || 0,
      averageScore: Math.round(results[0]?.avgScore || 0),
      bestScore: Math.round(results[0]?.bestScore || 0),
      hoursStudied: Math.floor((results[0]?.testsTaken || 0) * 0.75),
      weeklyTests: weeklyResults[0]?.weeklyTests || 0,
      recentActivity: recentTests
    };

    res.json(stats);
  } catch (error) {
    console.error('Stats by exam type fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch stats by exam type' });
  }
});

// Update user profile
app.put('/api/user/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, email, mobile, photo } = req.body;
    
    console.log('Updating profile for user:', userId, { fullName, email, mobile, hasPhoto: !!photo });
    
    const [result] = await pool.query(
      'UPDATE users SET full_name = ?, email = ?, mobile = ?, photo = ? WHERE id = ?',
      [fullName, email, mobile, photo, userId]
    );
    
    console.log('Update result:', result);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get question counts by practice section
app.get('/api/questions/counts', async (req, res) => {
  try {
    const [pyqCount] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE practice_section = "pyq"');
    const [modelCount] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE practice_section = "model_papers"');
    const [districtCount] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE practice_section = "district_papers"');
    const [subjectCount] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE practice_section = "subject_wise"');
    
    const counts = {
      pyq: pyqCount[0]?.count || 0,
      model: modelCount[0]?.count || 0,
      district: districtCount[0]?.count || 0,
      subject: subjectCount[0]?.count || 0
    };

    res.json(counts);
  } catch (error) {
    console.error('Question counts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch question counts' });
  }
});

// Get question counts by year for PYQ section
app.get('/api/questions/counts/pyq', async (req, res) => {
  try {
    const years = Array.from({ length: 11 }, (_, i) => 2025 - i);
    const yearCounts = {};
    
    for (const year of years) {
      const [count] = await pool.query(
        'SELECT COUNT(*) as count FROM questions WHERE practice_section = "pyq" AND exam_year = ?',
        [year]
      );
      yearCounts[year] = count[0]?.count || 0;
    }
    
    res.json(yearCounts);
  } catch (error) {
    console.error('PYQ counts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch PYQ question counts' });
  }
});

// Get question counts by year for PYQ section filtered by exam type
app.get('/api/questions/counts/pyq/:examType', async (req, res) => {
  try {
    const { examType } = req.params;
    const category = examType === 'police' ? 'police_bharti' : 'talathi_bharti';
    const years = Array.from({ length: 11 }, (_, i) => 2025 - i);
    const yearCounts = {};
    
    for (const year of years) {
      const [count] = await pool.query(
        'SELECT COUNT(*) as count FROM questions WHERE practice_section = "pyq" AND category = ? AND exam_year = ?',
        [category, year]
      );
      yearCounts[year] = count[0]?.count || 0;
    }
    
    res.json(yearCounts);
  } catch (error) {
    console.error('PYQ counts by exam type fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch PYQ question counts by exam type' });
  }
});

// Get question counts by set for Model Papers section filtered by exam type
app.get('/api/questions/counts/model/:examType', async (req, res) => {
  try {
    const { examType } = req.params;
    const category = examType === 'police' ? 'police_bharti' : 'talathi_bharti';
    const sets = [1, 2, 3, 4];
    const setCounts = {};
    
    for (const setNumber of sets) {
      const [count] = await pool.query(
        'SELECT COUNT(*) as count FROM questions WHERE practice_section = "model_papers" AND category = ? AND exam_year = ?',
        [category, setNumber]
      );
      setCounts[setNumber] = count[0]?.count || 0;
    }
    
    res.json(setCounts);
  } catch (error) {
    console.error('Model sets counts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch model sets question counts' });
  }
});

// Get question counts by exam type
app.get('/api/questions/counts/:examType', async (req, res) => {
  try {
    const { examType } = req.params;
    const category = examType === 'police' ? 'police_bharti' : 'talathi_bharti';
    
    const [pyqCount] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE practice_section = "pyq" AND category = ?', [category]);
    const [modelCount] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE practice_section = "model_papers" AND category = ?', [category]);
    const [districtCount] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE practice_section = "district_papers" AND category = ?', [category]);
    const [subjectCount] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE practice_section = "subject_wise" AND category = ?', [category]);
    
    const counts = {
      pyq: pyqCount[0]?.count || 0,
      model: modelCount[0]?.count || 0,
      district: districtCount[0]?.count || 0,
      subject: subjectCount[0]?.count || 0
    };

    res.json(counts);
  } catch (error) {
    console.error('Question counts by exam type fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch question counts by exam type' });
  }
});

// Change password
app.put('/api/user/password/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    // Verify current password
    const [rows] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (rows[0].password !== currentPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Update password
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [newPassword, userId]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).json({ error: 'Failed to update password' });
  }
});

// Admin: Get recent students
app.get('/api/admin/students/recent', async (req, res) => {
  try {
    const [students] = await pool.query(
      'SELECT id, full_name, email, mobile, created_at FROM users WHERE role = "student" ORDER BY created_at DESC LIMIT 10'
    );
    res.json(students);
  } catch (error) {
    console.error('Recent students fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Admin: Get all students
app.get('/api/admin/students/all', async (req, res) => {
  try {
    const [students] = await pool.query(
      'SELECT id, full_name, email, mobile, created_at FROM users WHERE role = "student" ORDER BY created_at DESC'
    );
    res.json(students);
  } catch (error) {
    console.error('All students fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Admin: Delete student
app.delete('/api/admin/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // First delete related records (results)
    await pool.query('DELETE FROM results WHERE user_id = ?', [id]);
    
    // Then delete the student
    const [result] = await pool.query('DELETE FROM users WHERE id = ? AND role = "student"', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Student deletion error:', error);
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

// Notice management endpoints

// Get all active notices
app.get('/api/notices', async (req, res) => {
  try {
    const [notices] = await pool.query(
      'SELECT n.*, u.full_name as created_by_name FROM notices n JOIN users u ON n.created_by = u.id WHERE n.is_active = TRUE ORDER BY n.priority DESC, n.created_at DESC'
    );
    res.json(notices);
  } catch (error) {
    console.error('Notices fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// Admin: Get all notices
app.get('/api/admin/notices', async (req, res) => {
  try {
    const [notices] = await pool.query(
      'SELECT n.*, u.full_name as created_by_name FROM notices n JOIN users u ON n.created_by = u.id ORDER BY n.created_at DESC'
    );
    res.json(notices);
  } catch (error) {
    console.error('Admin notices fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
});

// Admin: Create notice
app.post('/api/admin/notices', async (req, res) => {
  try {
    const { title, content, priority } = req.body;
    const adminId = req.body.adminId; // Should be passed from frontend
    
    const [result] = await pool.query(
      'INSERT INTO notices (title, content, priority, created_by) VALUES (?, ?, ?, ?)',
      [title, content, priority, adminId]
    );
    
    res.status(201).json({ message: 'Notice created successfully', id: result.insertId });
  } catch (error) {
    console.error('Notice creation error:', error);
    res.status(500).json({ error: 'Failed to create notice' });
  }
});

// Admin: Update notice
app.put('/api/admin/notices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, priority, is_active } = req.body;
    
    const [result] = await pool.query(
      'UPDATE notices SET title = ?, content = ?, priority = ?, is_active = ? WHERE id = ?',
      [title, content, priority, is_active, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    
    res.json({ message: 'Notice updated successfully' });
  } catch (error) {
    console.error('Notice update error:', error);
    res.status(500).json({ error: 'Failed to update notice' });
  }
});

// Admin: Delete notice
app.delete('/api/admin/notices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM notices WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Notice not found' });
    }
    
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    console.error('Notice deletion error:', error);
    res.status(500).json({ error: 'Failed to delete notice' });
  }
});

// Question management endpoints

// Get question counts by category
app.get('/api/admin/questions/counts', async (req, res) => {
  try {
    const [policeBharti] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE category = "police_bharti"');
    const [talathiBharti] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE category = "talathi_bharti"');
    const [total] = await pool.query('SELECT COUNT(*) as count FROM questions');
    
    res.json({
      policeBharti: policeBharti[0]?.count || 0,
      talathiBharti: talathiBharti[0]?.count || 0,
      total: total[0]?.count || 0
    });
  } catch (error) {
    console.error('Question counts fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch question counts' });
  }
});

// Get all questions
app.get('/api/admin/questions', async (req, res) => {
  try {
    const [questions] = await pool.query(
      'SELECT * FROM questions ORDER BY created_at DESC'
    );
    res.json(questions);
  } catch (error) {
    console.error('Questions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get questions by practice section for students
app.get('/api/questions/:practiceSection', async (req, res) => {
  try {
    const { practiceSection } = req.params;
    console.log('Fetching questions for practice section:', practiceSection);
    
    const [questions] = await pool.query(
      'SELECT * FROM questions WHERE practice_section = ? ORDER BY RAND() LIMIT 50',
      [practiceSection]
    );
    
    console.log(`Found ${questions.length} questions for section ${practiceSection}`);
    res.json(questions);
  } catch (error) {
    console.error('Questions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get questions by practice section and exam type
app.get('/api/questions/:examType/:practiceSection', async (req, res) => {
  try {
    const { examType, practiceSection } = req.params;
    const category = examType === 'police' ? 'police_bharti' : 'talathi_bharti';
    
    console.log('Fetching questions for:', { examType, practiceSection, category });
    
    const [questions] = await pool.query(
      'SELECT * FROM questions WHERE practice_section = ? AND category = ? ORDER BY RAND() LIMIT 50',
      [practiceSection, category]
    );
    
    console.log(`Found ${questions.length} questions for ${examType} ${practiceSection}`);
    res.json(questions);
  } catch (error) {
    console.error('Questions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get questions by exam type, practice section and year
app.get('/api/questions/:examType/:practiceSection/:year', async (req, res) => {
  try {
    const { examType, practiceSection, year } = req.params;
    const category = examType === 'police' ? 'police_bharti' : 'talathi_bharti';
    
    console.log('Fetching questions for:', { examType, practiceSection, year, category });
    
    const [questions] = await pool.query(
      'SELECT * FROM questions WHERE practice_section = ? AND category = ? AND exam_year = ? ORDER BY RAND() LIMIT 50',
      [practiceSection, category, year]
    );
    
    console.log(`Found ${questions.length} questions for ${examType} ${practiceSection} ${year}`);
    res.json(questions);
  } catch (error) {
    console.error('Questions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Create question
app.post('/api/admin/questions', async (req, res) => {
  try {
    const { question_text, option_a, option_b, option_c, option_d, correct_answer, category, difficulty, practice_section, exam_year } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, category, difficulty, practice_section, exam_year) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [question_text, option_a, option_b, option_c, option_d, correct_answer, category, difficulty, practice_section, exam_year || null]
    );
    
    res.status(201).json({ message: 'Question created successfully', id: result.insertId });
  } catch (error) {
    console.error('Question creation error:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
});

// Update question
app.put('/api/admin/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { question_text, option_a, option_b, option_c, option_d, correct_answer, category, difficulty, practice_section, exam_year } = req.body;
    
    const [result] = await pool.query(
      'UPDATE questions SET question_text = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_answer = ?, category = ?, difficulty = ?, practice_section = ?, exam_year = ? WHERE id = ?',
      [question_text, option_a, option_b, option_c, option_d, correct_answer, category, difficulty, practice_section, exam_year || null, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json({ message: 'Question updated successfully' });
  } catch (error) {
    console.error('Question update error:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
});

// Delete question
app.delete('/api/admin/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await pool.query('DELETE FROM questions WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Question deletion error:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
});

// Bulk upload questions
app.post('/api/admin/questions/bulk', async (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Invalid questions data' });
    }
    
    const values = questions.map(q => [
      q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, 
      q.correct_answer, q.category || 'general', q.difficulty || 'medium', 
      q.practice_section || 'subject_wise', q.exam_year || null
    ]);
    
    await pool.query(
      'INSERT INTO questions (question_text, option_a, option_b, option_c, option_d, correct_answer, category, difficulty, practice_section, exam_year) VALUES ?',
      [values]
    );
    
    res.status(201).json({ message: `${questions.length} questions uploaded successfully` });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ error: 'Failed to upload questions' });
  }
});

// Bulk upload questions from PDF (placeholder for future implementation)
app.post('/api/admin/questions/bulk-pdf', upload.single('pdf'), async (req, res) => {
  try {
    res.status(501).json({ error: 'PDF upload feature is currently under development. Please use text format for now.' });
  } catch (error) {
    console.error('PDF upload error:', error);
    res.status(500).json({ error: 'Failed to process PDF file' });
  }
});

// Results management endpoints

// Get specific result by ID
app.get('/api/results/:resultId', async (req, res) => {
  try {
    const { resultId } = req.params;
    
    const [results] = await pool.query(
      `SELECT r.*, u.full_name as student_name, 
              COALESCE(e.title, 'Practice Quiz') as exam_title,
              COALESCE(e.exam_type, 'general') as exam_type
       FROM results r 
       LEFT JOIN users u ON r.user_id = u.id 
       LEFT JOIN exams e ON r.exam_id = e.id 
       WHERE r.id = ?`,
      [resultId]
    );
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Result not found' });
    }
    
    const result = results[0];
    
    // Parse detailed answers if available
    if (result.detailed_answers) {
      try {
        result.analysis = JSON.parse(result.detailed_answers);
      } catch (e) {
        console.error('Failed to parse detailed answers:', e);
      }
    }
    
    res.json(result);
  } catch (error) {
    console.error('Result fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch result' });
  }
});

// Submit quiz result
app.post('/api/results', async (req, res) => {
  try {
    const { user_id, exam_id, score, total_questions, percentage, time_spent, answers, questions } = req.body;
    
    const [result] = await pool.query(
      'INSERT INTO results (user_id, exam_id, score, total_questions, percentage, time_spent, detailed_answers) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, exam_id, score, total_questions, percentage, time_spent || 0, JSON.stringify({ answers, questions })]
    );
    
    res.status(201).json({ 
      message: 'Result saved successfully', 
      resultId: result.insertId 
    });
  } catch (error) {
    console.error('Result save error:', error);
    res.status(500).json({ error: 'Failed to save result' });
  }
});

// Get result statistics for comparison
app.get('/api/results/stats/:examType', async (req, res) => {
  try {
    const { examType } = req.params;
    
    const [stats] = await pool.query(
      `SELECT 
         AVG(percentage) as average_score,
         MAX(percentage) as highest_score,
         COUNT(*) as total_attempts
       FROM results r
       LEFT JOIN exams e ON r.exam_id = e.id
       WHERE COALESCE(e.exam_type, 'general') = ?`,
      [examType]
    );
    
    res.json({
      averageScore: Math.round(stats[0]?.average_score || 0),
      highestScore: Math.round(stats[0]?.highest_score || 0),
      totalAttempts: stats[0]?.total_attempts || 0
    });
  } catch (error) {
    console.error('Result stats fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch result statistics' });
  }
});

// Get topper data for specific exam context
app.get('/api/results/topper/:examType/:section', async (req, res) => {
  try {
    const { examType, section } = req.params;
    
    // Build query based on context
    let query = `
      SELECT r.*, u.full_name as student_name, r.detailed_answers
      FROM results r 
      LEFT JOIN users u ON r.user_id = u.id 
      WHERE r.percentage = (
        SELECT MAX(percentage) FROM results 
        WHERE detailed_answers IS NOT NULL
      )
      AND r.detailed_answers IS NOT NULL
      ORDER BY r.created_at DESC
      LIMIT 1
    `;
    
    const [topperResult] = await pool.query(query);
    
    if (topperResult.length === 0) {
      return res.json({ message: 'No topper data available' });
    }
    
    const topper = topperResult[0];
    
    // Parse analysis data
    let analysis = null;
    if (topper.detailed_answers) {
      try {
        analysis = JSON.parse(topper.detailed_answers);
      } catch (e) {
        console.error('Failed to parse topper analysis:', e);
      }
    }
    
    res.json({
      score: topper.percentage,
      timeSpent: topper.time_spent,
      studentName: topper.student_name,
      totalQuestions: topper.total_questions,
      correctAnswers: topper.score,
      examContext: `${examType} - ${section}`,
      analysis: analysis
    });
  } catch (error) {
    console.error('Topper data fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch topper data' });
  }
});

// Get topper data with filter
app.get('/api/results/topper/:examType/:section/:filter', async (req, res) => {
  try {
    const { examType, section, filter } = req.params;
    
    // Build query based on context
    let query = `
      SELECT r.*, u.full_name as student_name, r.detailed_answers
      FROM results r 
      LEFT JOIN users u ON r.user_id = u.id 
      WHERE r.percentage = (
        SELECT MAX(percentage) FROM results 
        WHERE detailed_answers IS NOT NULL
      )
      AND r.detailed_answers IS NOT NULL
      ORDER BY r.created_at DESC
      LIMIT 1
    `;
    
    const [topperResult] = await pool.query(query);
    
    if (topperResult.length === 0) {
      return res.json({ message: 'No topper data available' });
    }
    
    const topper = topperResult[0];
    
    // Parse analysis data
    let analysis = null;
    if (topper.detailed_answers) {
      try {
        analysis = JSON.parse(topper.detailed_answers);
      } catch (e) {
        console.error('Failed to parse topper analysis:', e);
      }
    }
    
    res.json({
      score: topper.percentage,
      timeSpent: topper.time_spent,
      studentName: topper.student_name,
      totalQuestions: topper.total_questions,
      correctAnswers: topper.score,
      examContext: `${examType} - ${section} - ${filter}`,
      analysis: analysis
    });
  } catch (error) {
    console.error('Topper data fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch topper data' });
  }
});

// Debug endpoint to check questions in database
app.get('/api/debug/questions', async (req, res) => {
  try {
    const [questions] = await pool.query('SELECT id, practice_section, category, exam_year, LEFT(question_text, 50) as question_preview FROM questions ORDER BY created_at DESC LIMIT 20');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check question counts by category and year
app.get('/api/debug/question-counts', async (req, res) => {
  try {
    const [totalCount] = await pool.query('SELECT COUNT(*) as count FROM questions');
    const [pyqCount] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE practice_section = "pyq"');
    const [policeCount] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE category = "police_bharti"');
    const [talathiCount] = await pool.query('SELECT COUNT(*) as count FROM questions WHERE category = "talathi_bharti"');
    const [yearCounts] = await pool.query('SELECT exam_year, COUNT(*) as count FROM questions WHERE practice_section = "pyq" GROUP BY exam_year ORDER BY exam_year DESC');
    
    res.json({
      total: totalCount[0]?.count || 0,
      pyq: pyqCount[0]?.count || 0,
      police: policeCount[0]?.count || 0,
      talathi: talathiCount[0]?.count || 0,
      byYear: yearCounts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    res.json({ status: 'OK', database: 'Connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'Disconnected', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
  console.log(`✅ Health check: http://localhost:${port}/api/health`);
  console.log(`✅ Admin login: http://localhost:${port}/api/admin/login`);
  console.log('Debug endpoints:');
  console.log(`- http://localhost:${port}/api/debug/questions`);
  console.log(`- http://localhost:${port}/api/debug/question-counts`);
});

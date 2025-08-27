import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Dinesh@123',
  database: 'prepwise',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log("Database connected successfully");
    connection.release();
  })
  .catch(err => {
    console.error("Database connection failed:", err.message);
  });

export default pool;

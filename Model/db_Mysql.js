const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Create a MySQL connection
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 100, // Increased connection limit (adjust this as needed)
  queueLimit: 0
});

// Connect to the database
connection.getConnection((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
  
});

// Export the MySQL connection
module.exports = connection;

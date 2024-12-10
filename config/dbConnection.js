const mysql = require("mysql2");
const dotenv = require("dotenv")
dotenv.config();


// Create a connection to the database
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Your MySQL host (usually 'localhost' for local databases)
  user: process.env.DB_USER, // Your MySQL username
  password: process.env.DB_PASSWORD, // Your MySQL password
  database: process.env.DB_DATABASE, // The name of your MySQL database
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.message);
    return;
  }
  console.log("Connected to MySQL database!");
});

module.exports = db;

const db = require("../config/dbConnection");

// Register a new user
// exports.addReview = async (name, email, rating, feedback) => {

//   const query = `
//   INSERT INTO organic_farmer_feedback_table(
//    name, email, rating, feedback
//   )VALUES(?,?,?,?)`;

//   // Execute the query with the user data
//   const [results] = await db
//     .promise()
//     .query(query, [name, email, rating, feedback]);

//   return results;
// };

exports.addReview = async (name, email, rating, feedback) => {
  try {
    console.log("Connecting to database...");
    const query = `
      INSERT INTO organic_farmer_feedback_table (name, email, rating, feedback)
      VALUES (?, ?, ?, ?)
    `;
    // console.log("Executing query:", query);
    const [result] = await db.promise().query(query, [name, email, rating, feedback]);
    // console.log("Query result:", result);
    return result.insertId;
  } catch (error) {
    console.error("Database Error:", error.message);
    throw error;
  }
};



// Fetch all reviews
exports.getAllReviews = async () => {
  const query = "SELECT * FROM organic_farmer_feedback_table";
  const [rows] = await db.promise().query(query);
  return rows;
};
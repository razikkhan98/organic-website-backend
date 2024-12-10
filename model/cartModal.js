// const db = require("../config/dbConnection");

// // Find an item in the user's cart by user and product IDs
// exports.findCartItem = async (user_id, product_id) => {
//   const query =
//     "SELECT * FROM organic_farmer_table_addtocart WHERE user_id = ? AND product_id = ?";
//   const [rows] = await db.promise().query(query, [user_id, product_id]);
//   return rows[0]; // Return the first item found or null
// };



// // Add a new item to the cart
// exports.addCartItem = async (cartItem) => {
//   const {
//     user_id,
//     product_id,
//     product_name,
//     product_price,
//     product_quantity,
//     product_total_amount,
//   } = cartItem;

//   const query = `INSERT INTO organic_farmer_table_addtocart (user_id, product_id, product_name, product_price, product_quantity, product_total_amount) 
//                  VALUES (?, ?, ?, ?, ?, ?)`;

//   await db.promise().query(query, [
//     user_id,
//     product_id,
//     product_name,
//     product_price,
//     product_quantity,
//     product_total_amount,
//   ]);
// };



// // Update an existing item in the cart
// exports.updateCartItem = async (user_id, product_id, newQuantity, newTotalAmount) => {
//   const query = `UPDATE organic_farmer_table_addtocart 
//                  SET product_quantity = ?, product_total_amount = ? 
//                  WHERE user_id = ? AND product_id = ?`;

//   await db.promise().query(query, [newQuantity, newTotalAmount, user_id, product_id]);
// };


// // Remove an item from the cart
// exports.removeCartItem = async (user_id, product_id) => {
//   const query = "DELETE FROM organic_farmer_table_addtocart WHERE user_id = ? AND product_id = ?";
//   await db.promise().query(query, [user_id, product_id]);
// };


const db = require("../config/dbConnection");
 
// Find an item in the user's cart by user and product IDs
// exports.findCartItem = async (product_id) => {
//   const query =
//     "SELECT * FROM organic_farmer_table_addtocart WHERE product_id = ?";
//   const [rows] = await db.promise().query(query, [product_id]);
//   return rows[0]; // Return the first item found or null
// };
exports.findCartItem = async (product_id) => {
  const [results] = await db.promise().query(
    "SELECT * FROM organic_farmer_table_addtocart WHERE product_id = ?",
    [product_id]
  );
  return results[0]; // Return the first match or undefined
};
// Add a new item to the cart
exports.addCartItem = async (cartItem) => {
  const {
    product_id,
    product_price,
    product_weight,
    product_quantity,
    product_total_amount,
  } = cartItem;
 
  const query = `INSERT INTO organic_farmer_table_addtocart (product_id, product_price, product_weight, product_quantity, product_total_amount)
                 VALUES ( ?, ?, ?, ?, ?)`;
 
  await db
    .promise()
    .query(query, [
      product_id,
      product_price,
      product_weight,
      product_quantity,
      product_total_amount,
    ]);
};
 
// Update an existing item in the cart
exports.updateCartItem = async (product_id, newQuantity, newTotalAmount) => {
  const query = `UPDATE organic_farmer_table_addtocart
                 SET product_quantity = ?, product_total_amount = ?
                 WHERE product_id = ?`;
 
  await db.promise().query(query, [newQuantity, newTotalAmount, product_id]);
};
 
// Remove an item from the cart
// exports.removeCartItem = async (product_id) => {
//   const query =
//     "DELETE FROM organic_farmer_table_addtocart WHERE product_id = ?";
//   await db.promise().query(query, [product_id]);
// };

exports.removeCartItem = async (product_id) => {
  const [results] = await db.promise().query(
    "DELETE FROM organic_farmer_table_addtocart WHERE product_id = ?",
    [product_id]
  );
  return results.affectedRows > 0; // Return true if the item was deleted
};
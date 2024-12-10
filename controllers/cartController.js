// // controllers/cartController.js

// const asyncHandler = require("express-async-handler");
// const cartModel = require("../model/cartModal");

// // Add to cart
// exports.addToCart = asyncHandler(async (req, res) => {
//   const userAddToCart = req.body;

//   // Destructure userAddToCart to extract required fields
//   const {
//     user_id,
//     product_id,
//     product_name,
//     product_price,
//     product_quantity,
//     product_total_amount,
//   } = userAddToCart;

//   // Validate input data
//   if (
//     !user_id ||
//     !product_id ||
//     !product_name ||
//     !product_price ||
//     !product_quantity ||
//     !product_total_amount
//   ) {
//     return res
//       .status(400)
//       .json({ message: "Please provide all required fields" });
//   }

//   // Check if the product is already in the user's cart
//   const cartItem = await cartModel.findCartItem(user_id, product_id);
  
//   if (cartItem) {
//     // If the product is already in the cart, update the quantity and total amount
//     const newQuantity = cartItem.product_quantity + product_quantity;
//     const newTotalAmount = cartItem.product_total_amount + product_total_amount;

//     await cartModel.updateCartItem(
//       user_id,
//       product_id,
//       newQuantity,
//       newTotalAmount
//     );
//     return res.json({ message: "Product updated in cart" });
//   } else {
//     // If the product is not in the cart, create a new entry
//     await cartModel.addCartItem({
//       user_id,
//       product_id,
//       product_name,
//       product_price,
//       product_quantity,
//       product_total_amount,
//     });
//     return res.status(201).json({  success: true, message: "Product added to cart" });
//   }
// });





// // Remove from cart
// exports.removeFromCart = asyncHandler(async (req, res) => {
//   const { user_id, product_id } = req.body;

//   // Validate input data
//   if (!user_id || !product_id) {
//     return res.status(400).json({ message: "User ID and Product ID are required" });
//   }

//   // Find the cart item
//   const cartItem = await cartModel.findCartItem(user_id, product_id);

//   if (!cartItem) {
//     return res.status(404).json({ message: "Item not found in the cart" });
//   }

//   // Remove the item from the cart
//   await cartModel.removeCartItem(user_id, product_id);

//   res.status(200).json({  success: true , message: "Item removed from the cart successfully" });
// });



// controllers/cartController.js
 
const asyncHandler = require("express-async-handler");
const cartModel = require("../model/cartModal");
 
// Add to cart
exports.
addToCart = asyncHandler(async (req, res) => {
  const userAddToCart = req.body;
 
  // Destructure userAddToCart to extract required fields
  const {
    product_id,
    product_price,
    product_weight,
    product_quantity,
    product_total_amount,
  } = userAddToCart;
 
  // Validate input data
  if (
    // !user_id ||
 
    // !product_name ||
    !product_price ||
    !product_weight ||
    !product_quantity ||
    !product_total_amount
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }
 
  // Check if the product is already in the user's cart
  const cartItem = await cartModel.findCartItem(product_id);
 
  if (cartItem) {
    // If the product is already in the cart, update the quantity and total amount
    const newQuantity = cartItem.product_quantity + product_quantity;
    const newTotalAmount = cartItem.product_total_amount + product_total_amount;
 
    await cartModel.updateCartItem(product_id, newQuantity, newTotalAmount);
    return res.json({ message: "Product updated in cart" });
  } else {
    // If the product is not in the cart, create a new entry
    await cartModel.addCartItem({
      product_id,
      product_price,
      product_weight,
      product_quantity,
      product_total_amount,
    });
    return res
      .status(201)
      .json({ success: true, message: "Product added to cart" });
  }
});
 
// Remove from cart
// exports.removeFromCart = asyncHandler(async (req, res) => {

//   const { product_id } = req.body;

//   console.log(product_id)
 
//   // Validate input data
//   if (!product_id) {
//     return res
//       .status(400)
//       .json({ message: "User ID and Product ID are required" });
//   }
 
//   // Find the cart item
//   const cartItem = await cartModel.findCartItem(product_id);
 
//   if (!cartItem) {
//     return res.status(404).json({ message: "Item not found in the cart" });
//   }
 
//   // Remove the item from the cart
//   await cartModel.removeCartItem(product_id);
 
//   res.status(200).json({
//     success: true,
//     message: "Item removed from the cart successfully",
//   });
// });
 
exports.removeFromCart = asyncHandler(async (req, res) => {
  const { product_id } = req.body;


  // Validate input data
  if (!product_id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    // Check if the cart item exists
    const cartItem = await cartModel.findCartItem(product_id);

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in the cart" });
    }

    // Remove the item from the cart
    await cartModel.removeCartItem(product_id);

    res.status(200).json({
      success: true,
      message: "Item removed from the cart successfully",
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

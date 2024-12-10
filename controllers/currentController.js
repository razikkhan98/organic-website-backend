// controllers/currentController.js

const asyncHandler = require("express-async-handler");

// get current user

exports.currentUser = asyncHandler(async (req, res) => {
    
  
  // Check if user data exists (meaning the token was validated)
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

   // Extract user from request
   const user = req.user;
   
  // User is authenticated, respond with user details
  res.json(user);
  
});
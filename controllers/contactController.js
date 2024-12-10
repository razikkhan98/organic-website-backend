// // controllers/currentController.js

// const asyncHandler = require("express-async-handler");
// const contactModel = require("../model/contactController");


// exports.contact = asyncHandler(async (req, res) => {
//     const userContact = req.body;
    
//     // Destructure userData to extract required fields
//     const { user_name, user_email,user_mobile,user_subject, user_message } = userContact;
    
//     // Validate request data
    
//     if (!user_name ||!user_email ||!user_message || !user_mobile || !user_subject ) {
//         return res.status(400).json({ message: "Please required information " });
//     }

//       // new information
//       const newContact = {
//         user_name,
//         user_email,
//         user_mobile,
//         user_subject,
//         user_message,
//     };

//       // Save the new user to the database

//       try {
//         await contactModel.contact(newContact);
//         res.status(201).json({ success: true, message: "Contact information have been successfully" });
//       } catch (error) {
//         console.error("Database error:", error); // Log the error for debugging
//         res.status(500).json({ message: "Database error", error: error.message });
//       } 
    
  
// });


const asyncHandler = require("express-async-handler");
const contactModel = require("../model/contactController");

// Controller for handling contact form submissions
exports.contact = asyncHandler(async (req, res) => {
  const { user_name, user_email, user_mobile, user_subject, user_message } = req.body;

  // Validate required fields
  if (!user_name || !user_email || !user_mobile || !user_subject || !user_message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Prepare new contact data
  const newContact = {
    user_name,
    user_email,
    user_mobile,
    user_subject,
    user_message,
  };

  try {
    // Save the new contact to the database
    await contactModel.contact(newContact);
    res.status(201).json({
      success: true,
      message: "Contact information has been successfully saved.",
    });
  } catch (error) {
    console.error("Database error:", error); // Log the error for debugging
    res.status(500).json({
      message: "An error occurred while saving contact information.",
      error: error.message,
    });
  }
});

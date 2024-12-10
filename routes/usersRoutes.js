// routes/ussersRoutes.js

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController")
const feedbackController = require("../controllers/feedbackController")
// const paymentController = require("../controllers/paymentController")
const contactController = require("../controllers/contactController")






// User Add to cart
router.post('/login/addtocart', cartController.addToCart);

// User Add to cart remove
router.delete('/login/removecart', cartController.removeFromCart);

// User Feedback
router.post('/feedback', feedbackController.feedback)

// Route to fetch reviews
router.get("/allfeedback", feedbackController.getReviews);

// User Contact
router.post('/contact', contactController.contact)

// User Payment 
// router.post('/payment', paymentController.payment)






module.exports = router;

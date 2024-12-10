const asyncHandler = require("express-async-handler");
const reviewModel = require("../model/feedbackModel")
// const infoModel = require("../model/infoModel");


// exports.feedback = asyncHandler(async (req, res, next) => {
//   const userFeedback = req.body;

//   // Destructure userData to extract required fields
//   const { user_id, user_text, user_rating } = userFeedback;

//   // Validate request data

//   if (!user_id || !user_text || !user_rating) {
//     return res.status(400).json({ message: "Please required information" });
//   }

//   // new information
//   const newFeedback = {
//     user_id,
//     user_text,
//     user_rating,
//   };

//   // Save the new user to the database

//   try {
//     await userfeedbackModel.feedback(newFeedback);
//     res.status(201).json({ success: true, message: "Save information" });
//   } catch (error) {
//     res.status(500).json({ message: "Database error", error: error.message });
//   } 
  
// });

// Add a new review
// exports.feedback = async (req, res) => {
//   const { name, email, rating, feedback } = req.body;

//   console.log(req.body)

//   if (!name || !email || !rating) {
//     return res.status(400).json({ message: "Name, email, and rating are required" });
//   }


//   try {
//     const reviewId = await reviewModel.addReview(name, email, rating, feedback);
//     console.log("Review submitted successfully:", reviewId);

//     res.status(201).json({
//       success: true,
//       message: "Review submitted successfully!",
//       reviewId
//     });
//   } catch (error) {
//     console.error("Error submitting review:", error);
//     res.status(500).json({ error: "Failed to submit review" });
//   }
// };


// Add a new review
exports.feedback = async (req, res) => {
  const { name, email, rating, feedback } = req.body;

  if (!name || !email || !rating) {
    return res.status(400).json({ message: "Name, email, and rating are required" });
  }

  try {
    const reviewId = await reviewModel.addReview(name, email, rating, feedback);
    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      reviewId,
    });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
};


// Fetch reviews and calculate statistics
exports.getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.getAllReviews();
    const totalReviews = reviews.length;

    const ratingsBreakdown = [1, 2, 3, 4, 5].reduce((acc, rating) => {
      acc[rating] = reviews.filter((review) => review.rating === rating).length;
      return acc;
    }, {});

    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    res.status(200).json({
      averageRating: parseFloat(averageRating.toFixed(2)),
      totalReviews,
      ratingsBreakdown: {
        5: ((ratingsBreakdown[5] || 0) / totalReviews) * 100,
        4: ((ratingsBreakdown[4] || 0) / totalReviews) * 100,
        3: ((ratingsBreakdown[3] || 0) / totalReviews) * 100,
        2: ((ratingsBreakdown[2] || 0) / totalReviews) * 100,
        1: ((ratingsBreakdown[1] || 0) / totalReviews) * 100
      },
      reviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};
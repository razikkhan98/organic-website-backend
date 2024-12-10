// routes/paymentRoutes.js

const express = require("express");
const {
  getPhonePeUrl,
  getPhonePeUrlStatus,
  createPaymentAndGenerateUrl,
  getPhonePeUrlStatusAndUpdatePayment,
} = require("../controllers/paymentControllers");
const router = express.Router();

/**
 * phonePe routes
 * */
router.post("/create-order", createPaymentAndGenerateUrl);
router.post("/status", getPhonePeUrlStatusAndUpdatePayment);

module.exports = router;

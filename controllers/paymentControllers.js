// controllers/paymentController.js

const { default: axios } = require("axios");
const db = require("../config/dbConnection");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const {
  generateChecksumForPhonePe,
  generateMergedKey,
} = require("../utils/payment.service");

const jwt = require("jsonwebtoken");

const addPaymentRecord = (req, res) => {
  const { status, amount } = req.body;

  const query = `INSERT INTO Payments (status, paymentDetails, amount, isPaymentPaid) VALUES (?, ?, ?, ?)`;
  const paymentDetails = JSON.stringify({});

  db.promise().query(
    query,
    [status, paymentDetails, amount, false],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      res.json({
        success: true,
        message: "Payment record created.",
        paymentId: result.insertId,
      });
    }
  );
};

const getPhonePeUrl = async (req, res) => {
  const { name, mobileNumber, amount } = req.body;

  //   unique in every time
  const orderId = uuidv4();

  //payment
  const paymentPayload = {
    merchantId: process.env.PHONEPE_MERCHANT_ID,
    merchantUserId: name, // put userId,
    mobileNumber: mobileNumber,
    amount: amount * 100,
    merchantTransactionId: orderId,
    redirectUrl: `${process.env.REDIRECT_URL_TO_BACKEND_API}/?id=${orderId}`,
    redirectMode: "POST",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  const payload = Buffer.from(JSON.stringify(paymentPayload)).toString(
    "base64"
  );
  const checksum = await generateChecksumForPhonePe(payload);
  const option = {
    method: "POST",
    url: process.env.PHONEPE_MERCHANT_BASE_URL,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
    },
    data: {
      request: payload,
    },
  };
  try {
    const response = await axios.request(option);
    console.log("response:phonepe ", response?.data);
    console.log(response.data.data.instrumentResponse.redirectInfo.url);

    res.status(200).json({
      massage: "OK",
      success: true,
      url: response.data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    console.log("error in payment", error);
    res.status(500).json({ massage: "Failed to initiate payment", error });
  }
};

const getPhonePeUrlStatus = async (req, res) => {
  // app.post("/status", async (req, res) => {
  const merchantTransactionId = req.query.id;

  const keyIndex = process.env.SALT_INDEX;
  const string =
    `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` +
    process.env.PHONEPE_MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const option = {
    method: "GET",
    url: `${process.env.PHONEPE_MERCHANT_STATUS_URL}/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
    },
  };

  const response = await axios.request(option);
  console.log("response:phonepe_status ", response?.data);

  if (response.data.success) {
    return res.redirect(process.env.REDIRECT_URL_TO_SUCCESS_PAGE);
  } else {
    return res.redirect(process.env.REDIRECT_URL_TO_FAILURE_PAGE);
  }
};

/**
 * using this apis
 * */
const updatePaymentStatus = (req, res) => {
  const { paymentId, status, paymentDetails } = req.body;
  const query = `UPDATE Payments SET status = ?, paymentDetails = ?, isPaymentPaid = ? WHERE id = ?`;
  const isPaymentPaid = status === "PAID";

  db.promise().query(
    query,
    [status, JSON.stringify(paymentDetails), isPaymentPaid, paymentId],
    (err, result) => {
      if (err)
        return res.status(500).json({ success: false, error: err.message });
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ success: false, message: "Payment record not found." });

      res.json({ success: true, message: "Payment status updated." });
    }
  );
};

const createPaymentAndGenerateUrl = async (req, res) => {
  // const { status, amount, name, mobileNumber } = req.body;
  const {
    user_name,
    user_mobile_num,
    user_email,
    user_contact,
    user_state,
    user_city,
    user_country,
    user_house_number,
    user_landmark,
    user_pincode,
    user_total_amount,
  } = req.body;

  // Validate the payload
  if (
    !user_name ||
    !user_mobile_num ||
    !user_email ||
    !user_contact ||
    !user_state ||
    !user_city ||
    !user_country ||
    !user_house_number ||
    !user_landmark ||
    !user_pincode ||
    !user_total_amount
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  // Convert user_total_amount to paise for PhonePe
  const amountInPaise = user_total_amount * 100;

  // Insert user details into the database
  const userQuery = `INSERT INTO organic_farmer_table_payment (user_name,user_mobile_num, user_email, user_contact, user_state, user_city, user_country, user_house_number, user_landmark, user_pincode,user_total_amount)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)`;

  try {
    const [result] = await db.promise().query(userQuery, [
      user_name,
      user_mobile_num,
      user_email,
      user_contact,
      user_state,
      user_city,
      user_country,
      user_house_number,
      user_landmark,
      user_pincode,
      user_total_amount, // Store the original amount in the database
    ]);

    // Get the inserted user ID (if needed for future use)
    const userId = result.insertId;

    // Create a unique order ID
    const orderId = uuidv4();

    const mergedKey = await generateMergedKey(
      user_name,
      user_mobile_num,
      orderId
    ); // Create the merged key

    // Create a JWT for secure data exchange
    const token = jwt.sign(
      {
        userId,
        user_name,
        user_email,
        orderId,
        amountInPaise,
      },
      process.env.JWT_SECRET, // Use a strong secret key from your environment
      { expiresIn: "6m" } // Token expires in 6 minutes
    );

    // Define the payment payload for PhonePe
    const paymentPayload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantUserId: user_name, // Use userId if needed
      mobileNumber: user_mobile_num,
      amount: amountInPaise, // Use the amount in paise for PhonePe
      merchantTransactionId: orderId,
      redirectUrl: `${process.env.REDIRECT_URL_TO_BACKEND_API}/?id=${orderId}&tarnId=${userId}`,
      redirectMode: "POST",
      paymentInstrument: {
        type: "PAY_PAGE",
      },
    };

    // Encode the payload into Base64 format
    const payload = Buffer.from(JSON.stringify(paymentPayload)).toString(
      "base64"
    );

    // Generate the checksum for PhonePe request
    const checksum = await generateChecksumForPhonePe(payload);

    // Configure the request options for PhonePe API
    const option = {
      method: "POST",
      url: process.env.PHONEPE_MERCHANT_BASE_URL,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      data: {
        request: payload,
      },
    };

    // Make the API request to PhonePe
    const response = await axios.request(option);

    // Extract the redirect URL from PhonePe's response
    const redirectUrl = response.data.data.instrumentResponse.redirectInfo.url;

    if (!redirectUrl) {
      throw new Error("Redirect URL not found in PhonePe response");
    }

    // Respond with the created payment record and PhonePe URL
    res.json({
      success: true,
      massage: "OK",
      url: redirectUrl,
      token, // Include JWT in response
      mergedKey, // Include the generated key
    });
  } catch (error) {
    console.log("error: ", error);

    // Send an error response to the client
    res.status(500).json({
      success: false,
      message: "Failed to create payment or generate URL",
      error: error.message,
    });
  }
};

const getPhonePeUrlStatusAndUpdatePayment = async (req, res) => {
  const merchantTransactionId = req?.query?.id;
  const tarnId = req?.query?.tarnId;

  const keyIndex = process.env.SALT_INDEX;
  const string =
    `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}` +
    process.env.PHONEPE_MERCHANT_KEY;
  const sha256 = crypto.createHash("sha256").update(string).digest("hex");
  const checksum = sha256 + "###" + keyIndex;

  const option = {
    method: "GET",
    url: `${process.env.PHONEPE_MERCHANT_STATUS_URL}/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
    },
  };

  try {
    const response = await axios.request(option);
    console.log(response,"response")

    const paymentStatus = response.data.success ? "true" : "false";
    const paymentDetails = response.data;

    // Update payment status in the database
    const query = `UPDATE organic_farmer_table_payment SET status = ?, paymentDetails = ?, isPaymentPaid = ? WHERE id = ?`;
    const isPaymentPaid = paymentStatus === "true";

    const [result] = await db
      .promise()
      .query(query, [
        paymentStatus,
        JSON.stringify(paymentDetails),
        isPaymentPaid,
        tarnId,
      ]);

    if (result === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Payment record not found." });
    }

    console.log(response?.data?.code,"response")
    if (
      response?.data?.code === "PAYMENT_SUCCESS" &&
      paymentStatus === "true"
    ) {
      return res.redirect(process.env.REDIRECT_URL_TO_SUCCESS_PAGE);
    }

    if (response?.data?.code === "PAYMENT_ERROR") {
      return res.redirect(process.env.REDIRECT_URL_TO_FAILURE_PAGE);
    }
  } catch (err) {
    console.error(
      "Error fetching PhonePe status or updating database:",
      err.message
    );
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  addPaymentRecord,
  updatePaymentStatus,
  getPhonePeUrl,
  getPhonePeUrlStatus,
  createPaymentAndGenerateUrl,
  getPhonePeUrlStatusAndUpdatePayment,
};

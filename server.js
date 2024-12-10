const express = require("express");
const bodyParser = require('body-parser');
const usersRoutes = require("./routes/usersRoutes");
const usersPaymentRoute = require("./routes/paymentRoutes");

const { errorHandler } = require("./middlewares/errorHandler");
const dotenv = require("dotenv")
dotenv.config();
const cors = require("cors");

// Connect to the database
const db = require("./config/dbConnection");
db.connect();

// Initiate express app

const app = express();

const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json());

// Allow specific origins or all origins
app.use(cors({
  origin: "*", // Replace with your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  credentials: true // If you need to allow credentials (e.g., cookies)
}));

// Routes

app.use("/users", usersRoutes,usersPaymentRoute);


// Add other routes

// Error handling middleware
app.use(errorHandler);

// Starting the server

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const couponRoutes = require("./src/routes/couponRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");
const connectDB = require("./src/config/db");

// Load environment variables from .env file
dotenv.config();

// Initialize the Express app
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // Body parser for JSON input
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes
app.use("/api", couponRoutes); // All routes related to coupons

// Error handling middleware
app.use(errorHandler);

// Fallback route for non-existing endpoints
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;

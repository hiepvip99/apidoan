const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();

// Middleware
app.use(bodyParser.json());

// Import routes
const authRoutes = require("./api/routes/auth");
const categoryRoutes = require("./api/routes/category");

// Set up routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

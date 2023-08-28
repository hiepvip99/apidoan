const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();

// Middleware
app.use(bodyParser.json());

// Import routes
const authRoutes = require("./api/routes/auth");
const categoryRoutes = require("./api/routes/category");
const accountStatusRoutes = require("./api/routes/accountStatus");
const shoeCustomerRoute = require("./api/routes/shoeCustomerRoute");
const shoeColorRoute = require("./api/routes/shoeColorRoute");
const shoeSizeRoute = require("./api/routes/shoeSizeRoute");
const shoeDecentralizationRoutes = require("./api/routes/shoeDecentralizationRoutes");
const shoeManufacturerRoutes = require("./api/routes/shoeManufacturerRoutes");

// Set up routes
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/accountStatus", accountStatusRoutes);
app.use("/api/customer", shoeCustomerRoute);
app.use("/api/color", shoeColorRoute);
app.use("/api/size", shoeSizeRoute);
app.use("/api/decentralization", shoeDecentralizationRoutes);
app.use("/api/manufacturer", shoeManufacturerRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

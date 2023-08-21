const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Middleware
app.use(bodyParser.json());

// Import routes
const authRoutes = require("./routes/auth");
const shoesRoutes = require("./routes/shoes");
const customersRoutes = require("./routes/customers");

// Set up routes
app.use("/auth", authRoutes);
app.use("/shoes", shoesRoutes);
app.use("/customers", customersRoutes);

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

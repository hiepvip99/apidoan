const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Import routes
const authRoutes = require("./api/routes/auth");
const categoryRoutes = require("./api/routes/category");
const accountRoutes = require("./api/routes/shoeAccountRoute");
const shoeCustomerRoute = require("./api/routes/shoeCustomerRoute");
const shoeColorRoute = require("./api/routes/shoeColorRoute");
const shoeSizeRoute = require("./api/routes/shoeSizeRoute");
const shoeDecentralizationRoutes = require("./api/routes/shoeDecentralizationRoutes");
const shoeManufacturerRoutes = require("./api/routes/shoeManufacturerRoutes");
const shoeProductRoutes = require("./api/routes/shoeProductRoutes");
const shoeOrderRoutes = require("./api/routes/shoeOrderRoutes");
const shoeStatisticRoutes = require("./api/routes/statisticRoute");
const shoeCartRoutes = require("./api/routes/shoeCartRoute");
const favoriteRoute = require("./api/routes/favoriteRoute");
const discountRoute = require("./api/routes/discountRoute");
// const accountRoute = require("./api/routes/accountRoute");

// Set up routes
// app.use("/api/account", accountRoute);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/customer", shoeCustomerRoute);
app.use("/api/color", shoeColorRoute);
app.use("/api/size", shoeSizeRoute);
app.use("/api/decentralization", shoeDecentralizationRoutes);
app.use("/api/manufacturer", shoeManufacturerRoutes);
app.use("/api/product", shoeProductRoutes);
app.use("/api/order", shoeOrderRoutes);
app.use("/api", shoeStatisticRoutes);
app.use("/api/cart", shoeCartRoutes);
app.use("/api/favorite", favoriteRoute);
app.use("/api/discount", discountRoute);

app.get("/api/image/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = `uploads/${imageName}`;

  res.sendFile(imagePath, { root: __dirname });
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

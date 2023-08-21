const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Define auth routes
router.post("/login", authController.login);

module.exports = router;

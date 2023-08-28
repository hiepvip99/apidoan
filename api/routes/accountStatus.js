const express = require("express");
const router = express.Router();

const accountStatusController = require("../controllers/shoeAccountStatus");

// Define shoe routes
router.get("/status", accountStatusController.getAccountStatusById);

module.exports = router;

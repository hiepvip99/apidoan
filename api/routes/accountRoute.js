const express = require("express");
const router = express.Router();

const accountController = require("../controllers/shoeAccountController");

// Define shoe routes
router.get("/account_status", accountController.getAccountStatusById);

router.get("/get_by_id", accountController.getAccountById);

router.get("/getall", accountController.getAllAccount);

module.exports = router;

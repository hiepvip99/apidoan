const express = require("express");
const router = express.Router();

const accountController = require("../controllers/accountController");

// Define shoe routes
router.post("/login", accountController.login);
router.post("/createAccount", accountController.createAccount);
router.put("/updateAccount", accountController.updateAccount);
router.delete("/deleteAccount", accountController.deleteAccount);

module.exports = router;

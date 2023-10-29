const express = require("express");
const router = express.Router();

const accountController = require("../controllers/shoeAccountController");

// Define shoe routes
router.get("/account_status", accountController.getAccountStatusById);

router.get("/all_account_status", accountController.getAllStatusAccount);

router.get("/get_by_id", accountController.getAccountById);

router.get("/getall", accountController.getAllAccount);

router.post("/add", accountController.addAccount);

router.post("/login", accountController.login);

router.post("/register", accountController.registerUser);

router.put("/update", accountController.updateAccount);

router.delete("/delete", accountController.deleteAccount);

module.exports = router;

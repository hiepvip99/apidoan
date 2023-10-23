const express = require("express");
const router = express.Router();

const discountController = require("../controllers/discountController");

// Define shoe routes
// router.post("/login", discountController.login);
router.get("/Discount", discountController.getAllDiscount);
router.post("/Discount", discountController.addDiscount);
router.post("/applyDiscount", discountController.applyDiscount);
router.put("/Discount", discountController.updateDiscount);
router.delete("/Discount", discountController.deleteDiscount);

module.exports = router;

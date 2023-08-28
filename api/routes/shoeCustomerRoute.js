// shoeCustomerRoute.js

const express = require("express");
const router = express.Router();
const shoeCustomerController = require("../controllers/shoeCustomerController");

// Định nghĩa các route
router.get("/shoe_customers", shoeCustomerController.getAllShoeCustomers);
router.get("/shoe_customers/:id", shoeCustomerController.getShoeCustomerById);
router.post("/shoe_customers", shoeCustomerController.createShoeCustomer);
router.put("/shoe_customers/:id", shoeCustomerController.updateShoeCustomer);
router.delete("/shoe_customers/:id", shoeCustomerController.deleteShoeCustomer);
router.get(
  "/shoe_customers/account/:accountId",
  shoeCustomerController.getShoeCustomersByAccountId
);

module.exports = router;

// shoeCustomerRoute.js

const express = require("express");
const router = express.Router();
const shoeCustomerController = require("../controllers/shoeCustomerController");

// Định nghĩa các route
router.get("/shoe_customers", shoeCustomerController.getAllShoeCustomers);
router.get("/shoe_notification", shoeCustomerController.getNotificationByAccountId);
router.get(
  "/shoe_customersById",
  shoeCustomerController.getShoeCustomerByIdAccount
);
router.post("/shoe_customers", shoeCustomerController.createShoeCustomer);
router.put("/shoe_customers", shoeCustomerController.updateShoeCustomer);
router.put("/shoe_customers/address", shoeCustomerController.updateAddress);
router.put("/shoe_customers/notification", shoeCustomerController.updateNotificationToken);
router.put("/shoe_customers/image", shoeCustomerController.updateShoeCustomerImage);
router.post("/shoe_customers/check_customer_info", shoeCustomerController.checkCustomerInfo);
router.delete("/shoe_customers", shoeCustomerController.deleteShoeCustomer);
router.get(
  "/shoe_customers/account/:accountId",
  shoeCustomerController.getShoeCustomersByAccountId
);
router.get(
  "/shoe_customers/vip",
  shoeCustomerController.getVipCustomer
);

module.exports = router;

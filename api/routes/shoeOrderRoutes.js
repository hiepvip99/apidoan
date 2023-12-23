// shoeOrderRoutes.js
const express = require("express");
const router = express.Router();
const shoeOrderController = require("../controllers/shoeOrderController");

// Định nghĩa route GET /shoeOrders
router.get("/shoeOrders", shoeOrderController.getAll);

// Định nghĩa route GET /shoeOrders/:id
router.get("/shoeOrderById", shoeOrderController.getById);

// Định nghĩa route POST /shoeOrders
router.post("/shoeOrders", shoeOrderController.add);

router.post("/review", shoeOrderController.addReview);

router.get("/review", shoeOrderController.getReview);

router.get("/getAllReview", shoeOrderController.getAllReview);

router.get("/getAllOrderHistory", shoeOrderController.getAllOrderHistory);

router.get("/check_review", shoeOrderController.checkReviewExistence);
router.get("/max_id", shoeOrderController.getMaxId);

// Định nghĩa route PUT /shoeOrders/:id
// router.put("/shoeOrders", shoeOrderController.update);
// Định nghĩa route PUT /shoeOrders/:id


router.put("/shoeOrders/status", shoeOrderController.statusChange);

router.get("/shoeOrders/status", shoeOrderController.getStatusOrder);

// Định nghĩa route DELETE /shoeOrders/:id
// router.delete("/shoeOrders/:id", shoeOrderController.delete);

module.exports = router;

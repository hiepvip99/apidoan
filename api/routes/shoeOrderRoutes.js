// shoeOrderRoutes.js
const express = require("express");
const router = express.Router();
const shoeOrderController = require("../controllers/shoeOrderController");

// Định nghĩa route GET /shoeOrders
router.get("/shoeOrders", shoeOrderController.getAll);

// Định nghĩa route GET /shoeOrders/:id
router.get("/shoeOrders/:id", shoeOrderController.getById);

// Định nghĩa route POST /shoeOrders
router.post("/shoeOrders", shoeOrderController.add);

// Định nghĩa route PUT /shoeOrders/:id
router.put("/shoeOrders", shoeOrderController.update);
// Định nghĩa route PUT /shoeOrders/:id


router.put("/shoeOrders/status", shoeOrderController.statusChange);

// Định nghĩa route DELETE /shoeOrders/:id
router.delete("/shoeOrders/:id", shoeOrderController.delete);

module.exports = router;

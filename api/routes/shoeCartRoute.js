// shoeCartRoutes.js
const express = require("express");
const router = express.Router();
const shoeCartController = require("../controllers/shoeCartController");

// Định nghĩa route GET /shoeCarts
router.get("/shoeCarts", shoeCartController.getCart);

// Định nghĩa route GET /shoeCarts/:id
// router.get("/get_by_id", shoeCartController.getById);

// Định nghĩa route POST /shoeCarts
router.post("/shoeCarts", shoeCartController.addToCart);

// Định nghĩa route PUT /shoeCarts/:id
router.put("/shoeCarts", shoeCartController.updateQuantity);

// Định nghĩa route DELETE /shoeCarts/:id
router.delete("/shoeCarts", shoeCartController.removeFromCart);

module.exports = router;

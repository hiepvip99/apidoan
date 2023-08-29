// shoeProductRoutes.js
const express = require("express");
const router = express.Router();
const shoeProductController = require("../controllers/shoeProductController");

// Định nghĩa route GET /shoeProducts
// router.get("/shoeProducts", shoeProductController.getAll);
router.get("/shoeProducts", shoeProductController.getAllProduct);

// Định nghĩa route GET /shoeProducts/:id
router.get("/shoeProducts/:id", shoeProductController.getById);

// Định nghĩa route POST /shoeProducts
router.post("/shoeProducts", shoeProductController.add);

// Định nghĩa route PUT /shoeProducts/:id
router.put("/shoeProducts", shoeProductController.update);

// Định nghĩa route DELETE /shoeProducts/:id
router.delete("/shoeProducts/:id", shoeProductController.delete);

module.exports = router;

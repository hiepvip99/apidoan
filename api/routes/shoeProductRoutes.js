// shoeProductRoutes.js
const express = require("express");
// const multer = require("multer");
const router = express.Router();
// const upload = multer({ dest: "api/uploads/" });
const shoeProductController = require("../controllers/shoeProductController");

// Định nghĩa route GET /shoeProducts
// router.get("/shoeProducts", shoeProductController.getAll);
router.get("/shoeProducts", shoeProductController.getAllProduct);

// Định nghĩa route GET /shoeProducts/:id
router.get("/shoeProducts/:id", shoeProductController.getById);

// Định nghĩa route POST /shoeProducts
router.post("/shoeProducts", /* upload.array('images') , */shoeProductController.addProduct);

// Định nghĩa route PUT /shoeProducts/:id
// router.put("/shoeProducts", shoeProductController.updateProduct);

// router.put("/shoeProducts", shoeProductController.updateP);

// Định nghĩa route DELETE /shoeProducts/:id
router.delete("/shoeProducts/:id", shoeProductController.delete);

module.exports = router;

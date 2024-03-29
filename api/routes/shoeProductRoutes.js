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
router.get("/shoeProductsById", shoeProductController.getProductById);

// Định nghĩa route POST /shoeProducts
router.post("/shoeProducts", /* upload.array('images') , */shoeProductController.addProduct);

// Định nghĩa route PUT /shoeProducts/:id
router.put("/shoeProducts", shoeProductController.updateProduct);

// router.put("/shoeProducts", shoeProductController.updateP);

// Định nghĩa route DELETE /shoeProducts/:id
router.delete("/shoeProducts", shoeProductController.delete);

router.put("/uploadImage", shoeProductController.updateImageProduct);

router.put("/colorProduct", shoeProductController.updateProductColor);

router.put("/sizeProduct", shoeProductController.updateProductSize);

router.delete("/colorProduct", shoeProductController.deleteProductColor);

router.delete("/sizeProduct", shoeProductController.deleteProductSize);

router.post("/colorProduct", shoeProductController.createProductColor);

router.post("/sizeProduct", shoeProductController.createProductSize);

module.exports = router;

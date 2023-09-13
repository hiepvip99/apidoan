const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/shoeCategory");

// Define shoe routes
router.get("/categories", categoryController.getAllCategories);
router.get("/categoriesById", categoryController.getCategoryById);
router.post("/categories", categoryController.createCategory);
router.put("/categories", categoryController.updateCategory);
router.delete("/categories", categoryController.deleteCategory);

module.exports = router;

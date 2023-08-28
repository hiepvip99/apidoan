// shoeManufacturerRoutes.js
const express = require("express");
const router = express.Router();
const shoeManufacturerController = require("../controllers/shoeManufacturerController");

// Định nghĩa route GET /shoeManufacturers
router.get("/shoeManufacturers", shoeManufacturerController.getAll);

// Định nghĩa route GET /shoeManufacturers/:id
router.get("/shoeManufacturers/:id", shoeManufacturerController.getById);

// Định nghĩa route POST /shoeManufacturers
router.post("/shoeManufacturers", shoeManufacturerController.add);

// Định nghĩa route PUT /shoeManufacturers/:id
router.put("/shoeManufacturers", shoeManufacturerController.update);

// Định nghĩa route DELETE /shoeManufacturers/:id
router.delete("/shoeManufacturers/:id", shoeManufacturerController.delete);

module.exports = router;

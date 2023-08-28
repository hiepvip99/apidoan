// shoeDecentralizationRoutes.js
const express = require("express");
const router = express.Router();
const shoeDecentralizationController = require("../controllers/shoeDecentralizationController");
// Định nghĩa route GET /shoeDecentralizations
router.get("/shoeDecentralizations", shoeDecentralizationController.getAll);

// Định nghĩa route GET /shoeDecentralizations/:id
router.get(
  "/shoeDecentralizations/:id",
  shoeDecentralizationController.getById
);

// Định nghĩa route POST /shoeDecentralizations
router.post("/shoeDecentralizations", shoeDecentralizationController.add);

// Định nghĩa route PUT /shoeDecentralizations/:id
router.put("/shoeDecentralizations/:id", shoeDecentralizationController.update);

// Định nghĩa route DELETE /shoeDecentralizations/:id
router.delete(
  "/shoeDecentralizations/:id",
  shoeDecentralizationController.delete
);

module.exports = router;

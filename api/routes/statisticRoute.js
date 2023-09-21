// shoeStatisticRoutes.js
const express = require("express");
const router = express.Router();
const shoeStatisticController = require("../controllers/statisticController");

// Định nghĩa route GET /shoeStatistics
router.get("/statistics/monthly", shoeStatisticController.getStatisticByMonthly);

router.get("/statistics/weekly", shoeStatisticController.getStatisticByWeekly);

module.exports = router;

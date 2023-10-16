// shoeFavoriteRoute.js

const express = require("express");
const shoeFavoriteController = require("../controllers/favoriteController");

// Khởi tạo router
const router = express.Router();

// Định nghĩa route để lấy danh sách tất cả các màu giày
router.get("/favoriteProduct", shoeFavoriteController.getAllShoeFavoriteProduct);

router.get("/favoriteProduct/isFavorited",shoeFavoriteController.checkFavorite);

// // Định nghĩa route để lấy một màu giày dựa trên ID
// router.get("/favoriteProduct", shoeFavoriteController.getShoeFavoriteById);

// Định nghĩa route để tạo một màu giày mới
router.post("/favoriteProduct", shoeFavoriteController.createFavorite);

// Định nghĩa route để cập nhật một màu giày dựa trên ID
// router.put("/favoriteProduct", shoeFavoriteController.updateShoeFavorite);

// Định nghĩa route để xóa một màu giày dựa trên ID
router.delete("/favoriteProduct", shoeFavoriteController.deleteFavorite);

// Export router
module.exports = router;

// shoeSizeRoute.js

const express = require("express");
const shoeSizeController = require("../controllers/shoeSizeController");

// Khởi tạo router
const router = express.Router();

// Định nghĩa route để lấy danh sách tất cả các màu giày
router.get('/shoe-sizes', shoeSizeController.getAllShoeSizes);

// Định nghĩa route để lấy một màu giày dựa trên ID
router.get('/shoe-sizes/:id', shoeSizeController.getShoeSizeById);

// Định nghĩa route để tạo một màu giày mới
router.post('/shoe-sizes', shoeSizeController.createShoeSize);

// Định nghĩa route để cập nhật một màu giày dựa trên ID
router.put('/shoe-sizes/:id', shoeSizeController.updateShoeSize);

// Định nghĩa route để xóa một màu giày dựa trên ID
router.delete('/shoe-sizes/:id', shoeSizeController.deleteShoeSize);

// Export router
module.exports = router;

// shoeSizeRoute.js

const express = require("express");
const shoeSizeController = require("../controllers/shoeSizeController");

// Khởi tạo router
const router = express.Router();

// Định nghĩa route để lấy danh sách tất cả các màu giày
router.get('/shoe-colors', shoeSizeController.getAllShoeSizes);

// Định nghĩa route để lấy một màu giày dựa trên ID
router.get('/shoe-colors/:id', shoeSizeController.getShoeSizeById);

// Định nghĩa route để tạo một màu giày mới
router.post('/shoe-colors', shoeSizeController.createShoeSize);

// Định nghĩa route để cập nhật một màu giày dựa trên ID
router.put('/shoe-colors/:id', shoeSizeController.updateShoeSize);

// Định nghĩa route để xóa một màu giày dựa trên ID
router.delete('/shoe-colors/:id', shoeSizeController.deleteShoeSize);

// Export router
module.exports = router;

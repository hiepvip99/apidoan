// shoeColorRoute.js

const express = require("express");
const shoeColorController = require("../controllers/shoeColorController");

// Khởi tạo router
const router = express.Router();

// Định nghĩa route để lấy danh sách tất cả các màu giày
router.get('/shoe-colors', shoeColorController.getAllShoeColors);

// Định nghĩa route để lấy một màu giày dựa trên ID
router.get('/shoe-colors/:id', shoeColorController.getShoeColorById);

// Định nghĩa route để tạo một màu giày mới
router.post('/shoe-colors', shoeColorController.createShoeColor);

// Định nghĩa route để cập nhật một màu giày dựa trên ID
router.put('/shoe-colors/:id', shoeColorController.updateShoeColor);

// Định nghĩa route để xóa một màu giày dựa trên ID
router.delete('/shoe-colors/:id', shoeColorController.deleteShoeColor);

// Export router
module.exports = router;

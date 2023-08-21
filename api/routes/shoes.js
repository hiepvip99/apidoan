const express = require('express');
const router = express.Router();
const shoeController = require('../controllers/shoeController');

// Định tuyến GET danh sách giày
router.get('/', shoeController.getShoes);

// Định tuyến GET thông tin giày theo ID
router.get('/:id', shoeController.getShoeById);

// Định tuyến POST tạo mới giày
router.post('/', shoeController.createShoe);

// Định tuyến PUT cập nhật thông tin giày
router.put('/:id', shoeController.updateShoe);

// Định tuyến DELETE xóa giày
router.delete('/:id', shoeController.deleteShoe);

module.exports = router;
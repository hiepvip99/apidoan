'use strict';

const express = require('express')
const router = express.Router()
const ProductController = require('./controllers/productController');

router.get('/products', ProductController.get);

module.exports = router
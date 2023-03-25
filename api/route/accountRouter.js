'use strict';

const express = require('express');
const router = express.Router()
const AccountController = require('../controllers/accountController');

router.get('/accounts', AccountController.get);
router.get('/account/:keyword', AccountController.getId);
router.post('/account', AccountController.add);

module.exports = router;
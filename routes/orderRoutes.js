const express = require('express');
const orderController = require('./../controllers/orderController')
const authController = require('./../controllers/authController')

const router = express.Router();

router.get('/checkout-session/:productId', authController.protect, orderController.getCheckoutSession)

module.exports = router;
const express = require('express');
const orderController = require('./../controllers/orderController')
const authController = require('./../controllers/authController')

const router = express.Router();



router.route('/checkout-session-cart').post(authController.protect, orderController.getCheckoutCart)

router.get('/checkout-session/:productId', authController.protect, orderController.getCheckoutSessionSingleProduct);




module.exports = router;
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/productModel');
const factory = require('./handleFactory');
const AppError = require('./../utilies/AppError');

exports.getCheckoutSessionSingleProduct = async (req, res, next) => {
    try {
        // 1) Get the currently ordered Product
    const product = await Product.findById(req.params.productId);
    // console.log(product);
    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`, // user redirect this link after payment sucess
        cancel_url: `${req.protocol}://${req.get('host')}/`,
        customer_email: req.user.email,
        client_reference_id: req.params.productId,
        line_items: [
            {
                name: `${product.name} Product`,
                description: `${product.description}`,
                images: [`${product.images[0].url}`],
                amount: product.price,
                currency: 'usd',
                quantity: 1.
            }
        ]
    })
    console.log(session);
    // 3) Create session as responce
    res.status(200).json({
        status: 'success',
        session
    })
    } catch (error) {
        next(error)
    }
    
}


exports.getCheckoutCart = async (req, res, next) => {
    try {
        // 1) Get the currently ordered Product
        
        
    } catch (error) {
        next(error)
    }
}
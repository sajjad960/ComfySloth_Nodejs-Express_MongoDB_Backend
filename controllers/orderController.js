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
        //right now i am not checking if the product exist
       
        let products = req.body.cart.map(product => {
            return {
                name: `${product.name} Product`,
                images: [`${product.image}`],
                amount: product.price,
                currency: 'usd',
                quantity: product.amount
            }
        })

        // 2) create checkout session

        let session;
        if(process.env.NODE_ENV === 'development') {
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                success_url: process.env.LOCAL_HOST_ADDRESS, // user redirect this link after payment success
                cancel_url: process.env.LOCAL_HOST_ADDRESS,
                customer_email: req.user.email,
                // client_reference_id: req.params.productId,
                line_items: products
            })
        }
        if(process.env.NODE_ENV === 'production') {
            session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                success_url: process.env.HOST_ADDRESS, // user redirect this link after payment success
                cancel_url: process.env.HOST_ADDRESS,
                customer_email: req.user.email,
                // client_reference_id: req.params.productId,
                line_items: products
            })
        }
   
    // 3) Create session as responce
    res.status(200).json({
        status: 'success',
        session
    })
        
    } catch (error) {
        console.log(error);
    }
}
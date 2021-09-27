const Subscribers = require('../models/subscriberModel')

exports.createSubcriber = async (req, res, next) => {
    try {
        const subscriber = await Subscribers.create(req.body)

        res.status(201).json({
            status: 'success',
            message: "Thank you for subscribe"
        })
    } catch (err) {
        next(err)
    }
}
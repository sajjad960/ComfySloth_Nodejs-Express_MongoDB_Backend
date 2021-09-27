const mongoose = require('mongoose');
const validator = require('validator')

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    }
});

const Subscribers = mongoose.model('Subscribers', subscriberSchema);

module.exports = Subscribers;
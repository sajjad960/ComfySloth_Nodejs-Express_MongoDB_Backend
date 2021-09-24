const Users = require("../models/userModel")
const jwt = require('jsonwebtoken')
const AppError = require("../utilies/AppError")

const signToken = (id) => {
    jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
}

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id)

    // Remove password from output
    user.password = undefined,

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: user,
        }
    })
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await Users.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            role: req.body.role,
            passwordChangedAt: req.body.passwordChangeAt,
        })

        // create token,
        createSendToken(newUser, 201,req, res)
    } catch (err) {
        next(err)
    }
}

exports.login = async (req, res, next) => {
    const {email, password} = req.body;

    // check if email and password exist
    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    // check if user exist && password is correct
    const user = await Users.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 403))
    }
}
const { promisify } = require("util");
const Users = require("../models/userModel")
const jwt = require('jsonwebtoken')
const AppError = require("../utilies/AppError")

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

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
    try {
        const {email, password} = req.body;

    // check if email and password exist
    if(!email || !password) {
        return next(new AppError('Please provide email and password', 400))
    }

    // check if user exist && password is correct
    const user = await Users.findOne({email}).select('+password');

    if(!user || !(await user.currectPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 403))
    }

    // if everything ok, send token to client
    createSendToken(user, 201, req, res)

    } catch (err) {
        next(err)
    }
    
}


// Protect function
exports.protect = async (req,res, next) => {
    try {
       // Getting token and check of it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if(!token) {
        return next(new AppError('You are not log in! Please log in to get access', 401))
    }
    // Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // Check if user still exists
    const currentUser = await Users.findById(decoded.id);

    if(!currentUser) {
        return next(new AppError('The user belonging to this token does n longer exist', 401))
    }
    // Check if user changed password after the token was issued.
    if(currentUser.changedPasswordAfter(decoded.iat)) {
        return next(new AppError('User recently change password. Please log in again', 400))
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next() 
    } catch (err) {
        next(err)
    }
    
}

exports.restrictTo = (...roles) => (req, res, next) => {
    if(!roles.includes(req.user.role)) {
        return next(new AppError('You do not have permission to perform this action', 403))
    }
    next()
}

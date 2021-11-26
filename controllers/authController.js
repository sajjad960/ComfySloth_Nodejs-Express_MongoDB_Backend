const { promisify } = require("util");
const Users = require("../models/userModel")
const jwt = require('jsonwebtoken')
const AppError = require("../utilies/AppError")
const sendMail = require('../utilies/email')
const crypto = require('crypto')

const signToken = (id) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id)

    // Remove some feild from output
    user.password = undefined,
    user.passwordResetExpires = undefined,
    user.passwordResetToken = undefined

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

exports.forgotPassword = async (req, res, next) => {
    try {
        // 1) Get user based on posted email
        const user = await Users.findOne({email: req.body.email})

        if(!user) {
            return next(new AppError('There is no user with email address', 404))
        }
        // 2) Generate the random reset token
        const resetToken = user.createPasswordResetToken();
        await user.save({validateBeforeSave: false})

        let resetURL;
        // 3) Send it to user's email
        if(process.env.NODE_ENV === 'development') {
            resetURL = `${process.env.LOCAL_HOST_ADDRESS}/resetPassword/${resetToken}`;

        } else if(process.env.NODE_ENV === 'production') {

            resetURL = `${process.env.HOST_ADDRESS}/resetPassword/${resetToken}`;
        }

        // this message not using right now.
        const message = `Forgot your password ? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password please ignore this message`;

        try {
            await sendMail({
                email: user.email,
                subject: 'Your password reset token (valid for 10 min)',
                resetURL,
            })

            res.status(200).json({
                status: 'success',
                message: 'Token sent to email'
            })
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false });
      
            return next(
              new AppError('There was an error sending the email. Try again later')
            );
        }
    } catch (err) {
        next(err)
    }
}


exports.resetPassword = async (req, res, next) => {
    try {
        // 1) Get user based on the token
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await Users.findOne({passwordResetToken: hashedToken, passwordResetExpires: {$gt: Date.now()}});
        // 2) if token has not expired and there is user, set the new password,
        if(!user) {
            return next(new AppError('Token is invalid or has expired', 400))
        }

        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        // 3) Update changedPasswordAt property for the user

        // 4) Log the user in, send JWT
            createSendToken(user, 200, req, res)
    } catch (err) {
        next(err)
    }
}



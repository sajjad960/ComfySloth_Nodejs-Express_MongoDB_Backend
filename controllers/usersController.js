const Users = require('../models/userModel');
const AppError = require("../utilies/AppError");

// Factory controller
const factory = require('../controllers/handleFactory')

exports.getAllUsers = async (req, res,next) => {
    try {
        const users = await Users.find();

        // send responce
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        })
    } catch (error) {
        next(err);
    }
}

exports.createUser = factory.createOne(Users);
exports.getUser = factory.getOne(Users);
exports.updateUser = factory.updateOne(Users);
exports.deleteUser = factory.deleteOne(Users)

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id

    next()
}
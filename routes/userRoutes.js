const express = require('express');

// controller
const userController = require('../controllers/usersController')
const authController = require('../controllers/authController')

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protect all routes after this middleware
router.use(authController.protect)

router.get('/me', userController.getMe, userController.getUser)


router.route('/').get(userController.getAllUsers).post(userController.createUser);
router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
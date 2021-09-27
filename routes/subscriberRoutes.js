const express = require('express')
const subscriberController = require('../controllers/subscriberController')

const router = express.Router()

router.route('/').post(subscriberController.createSubcriber)

module.exports = router;
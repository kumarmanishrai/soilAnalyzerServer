const express = require('express')
const userAuthController = require('../controllers/UserAuthController')
const router = express.Router();

router.post('/create', userAuthController.create)
router.post('/login', userAuthController.login)
router.post('/login/pin', userAuthController.loginpin)
router.post('/about', userAuthController.about)
router.post('/:someUserId', userAuthController.someUser)
router.post('/validate-token/pin', userAuthController.validatePinToken)
router.post('/validate-token/password', userAuthController.validatePasswordToken)


module.exports = router;
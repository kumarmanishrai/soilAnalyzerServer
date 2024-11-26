const express = require('express')
const userAuthController = require('../controllers/UserAuthController')
const router = express.Router();

router.post('/create', userAuthController.create)
router.post('/login', userAuthController.login)
router.post('/login/pin', userAuthController.loginpin)
// router.post('/logout', userAuthController.logout)
// router.post('/authenticate', userAuthController.authenticate)


module.exports = router;
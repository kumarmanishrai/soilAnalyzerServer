const express = require('express')
const fieldController = require('../controllers/FieldController')

const router = express.Router();

// router.post('/create', fieldController.create)
// router.post('/delete', fieldController.delete)
router.get('/daily/data', fieldController.dailyData)
router.get('/minute/data', fieldController.minuteData)


module.exports = router
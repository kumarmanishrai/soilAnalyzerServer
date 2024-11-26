const express = require('express')

const postController = require('../controllers/PostController')

const router = express.Router()

router.post('/create', postController.create)
router.post('/delete', postController.delete)
router.post('/update', postController.update)
router.get('/allpost', postController.allpost)





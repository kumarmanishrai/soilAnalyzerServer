const express = require('express')
const User = require('../models/UserSchema')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();

const postController = require('../controllers/PostController')


const validateUser = async (req, res, next) => {
    // console.log(req.body)
    const passwordToken = req.body.passwordToken
    if (!passwordToken) {
      return res.status(401).json({ error: "No token provided" });
    }
    try {
      const decoded = jwt.verify(passwordToken, process.env.PASSWORD_KEY);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      req.user = user; // Attach user to the request
      next();
    } catch (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };

const router = express.Router()

router.post('/create', validateUser, postController.create)
router.post('/delete/:postId', validateUser, postController.delete)
router.post('/update/:postId', validateUser, postController.update)
router.get('/allpost', validateUser, postController.allpost)


module.exports = router


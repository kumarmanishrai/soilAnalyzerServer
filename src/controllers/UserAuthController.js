const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema')
const Post = require('../models/PostSchema')
const dotenv = require('dotenv');
const { response } = require('express');
dotenv.config();


exports.create = async (req, res, next) => {
  // console.log(req.body)
    const { email, password, pin } = req.body;
    const name = req.body.name || null
    const image = req.body.image || null

  try {
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);
    const user = new User({ email, password: hashedPassword, pin: hashedPin, name, image });
    await user.save();
    res.status(201).send({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).send({ error: 'User already exists!' });
  }
}


exports.about = async (req, res, next) => {
  const {passwordToken} = req.body;
  try {
    const decodedPasswordToken = jwt.verify(passwordToken, process.env.PASSWORD_KEY);
    const userId = decodedPasswordToken.userId;
    const user = await User.findById(userId);

    const userDetails = {
      name : user.name,
      email : user.email,
      image : user.image 
    }

    return res.status(200).json(userDetails)
  } catch (error) {
    res.status(500).send({ error: 'Something went wrong!' + err.message });
  }
}

exports.someUser = async (req, res, next) => {
  const {passwordToken} = req.body;
  const {someUserId} = req.params
  try {
    const decodedPasswordToken = jwt.verify(passwordToken, process.env.PASSWORD_KEY);
    const userId = decodedPasswordToken.userId;
    const user = await User.findById(userId);

    
    if(user){
      const someUser = await User.findById(someUserId);
      if(someUser){
        const someUserDetails = {
          name: someUser.name,
          email: someUser.email,
          image: someUser.image|| null,
        }
        res.status(200).json(someUserDetails);
      }
    }

  } catch (error) {
    res.status(500).send({ error: 'Something went wrong!' + err.message });
  }
}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const jwtTokenPassword = jwt.sign({ userId: user._id }, process.env.PASSWORD_KEY, { expiresIn: '30d' });
      user.jwtTokenPassword = jwtTokenPassword;
      await user.save({validateBeforeSave: false});
      res.send({ jwtTokenPassword, message: 'Login successful!' });
    } else {
      res.status(401).send({ error: 'Invalid credentials!' });
    }
  } catch (err) {

    res.status(500).send({ error: 'Something went wrong!' + err.message });
  }
}


exports.loginpin = async(req, res, next) => {
    const { pin, passwordToken } = req.body;
    // console.log(pin + ' ' + passwordToken)
    // console.log(process.env.PASSWORD_KEY)
  try {
    // console.log(process.env.PASSWORD_KEY)
    const decodedPasswordToken = jwt.verify(passwordToken, process.env.PASSWORD_KEY);
    // console.log(JSON.stringify(decodedPasswordToken))
    const userId = decodedPasswordToken.userId;
    // console.log("userId:" + userId)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (user && (await bcrypt.compare(pin, user.pin))) {
      const jwtTokenPin = jwt.sign({ userId: user._id.toString() }, process.env.PIN_KEY, { expiresIn: '2h' });
      user.jwtTokenPin = jwtTokenPin
      await user.save({validateBeforeSave: false})
      res.send({ jwtTokenPin, message: 'PIN login successful!' });
    } else {
      res.status(401).send({ error: 'Invalid PIN!' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: 'Something went wrong!' + err });
  }
}

exports.validatePinToken = async (req, res, next) => {
  const { token } = req.body;

  try {
    jwt.verify(token, process.env.PIN_KEY);
    res.status(200).json({ message: 'Pin Token is valid.' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired pin token.' });
  }
}

exports.validatePasswordToken = async (req, res, next) => {
  const { token } = req.body;

  try {
    jwt.verify(token, process.env.PASSWORD_KEY);
    res.status(200).json({ message: 'Password Token is valid.' });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired password token.' });
  }
}


// exports.logout = async(req, res, next) => {
//     try {
//         await User.findByIdAndUpdate(req.user._id, {
//             $set: {
//                 jwtTokenPassword: undefined,
//                 jwtTokenPin: undefined
//             },
//         },
//         {
//             new: true,
//         }
//     )
// return res.status(200).send({"User Logged out"})
//     } catch (error) {
        
//     }
// }
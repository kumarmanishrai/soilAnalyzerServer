const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema')
const dotenv = require('dotenv')
dotenv.config();


exports.create = async (req, res, next) => {
  console.log(req.body)
    const { email, password, pin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedPin = await bcrypt.hash(pin, 10);
    const user = new User({ email, password: hashedPassword, pin: hashedPin });
    await user.save();
    res.status(201).send({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).send({ error: 'User already exists!' });
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
    const { email, pin } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(pin, user.pin))) {
      const jwtTokenPin = jwt.sign({ userId: user._id }, process.env.PIN_KEY, { expiresIn: '2h' });
      user.jwtTokenPin = jwtTokenPin
      user.save({validateBeforeSave: false})
      res.send({ jwtTokenPin, message: 'PIN login successful!' });
    } else {
      res.status(401).send({ error: 'Invalid PIN!' });
    }
  } catch (err) {
    res.status(500).send({ error: 'Something went wrong!' + err });
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
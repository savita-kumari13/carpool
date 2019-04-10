const express = require('express')
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userRouter = express.Router();
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');

const User = require('../models/User');

userRouter.route('/register').post((req, res) => {

  const validateRegister = validateRegisterInput(req.body);
  console.log('isValid : ', validateRegister.status)
  if(!validateRegister.status) {
    return res.json(validateRegister);
  }
  console.log('user info : ', req.body)
  const avatar = gravatar.url(req.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm'
  });
  const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone_number: req.body.phone_number,
      avatar
  });
  User.findOne({
    email : req.body.email
  }).then(user => {
      if(user) {
        throw new Error('Email already exists');
      }
      return bcrypt.genSalt(10);
  }).then(salt=>{
    return bcrypt.hash(newUser.password, salt);
  }).then(hash=>{
    newUser.password = hash;
    return newUser.save();
  }).then(user=>{
    console.log(user);
    // return token
  }).catch(err=>{
    return res.send(err);
  });
});


  userRouter.route('/login').post((req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.email = 'User not found'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                name: user.name,
                                phone_number: user.phone_number,
                                avatar: user.avatar
                            }
                            jwt.sign(payload, 'secret', {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) {
                                  console.error('There is some error in token', err);
                                  res.json([])
                                }
                                else {
                                  console.log('token : ', token)
                                    res.json({
                                        success: true,
                                        //token: `Bearer ${token}`
                                        token: token
                                    });
                                }
                            });
                        }
                        else {
                            errors.password = 'Incorrect Password';
                            return res.status(400).json(errors);
                        }
                    });
        });
});


userRouter.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log("Success! You can not see this without a token")
  return res.json("Success! You can not see this without a token",{
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone_number: req.user.phone_number,
      
  });
});




userRouter.route('/').get(function (req, res) {
    console.log('Got the listing request')
    User.find(function (err, users){
    if(err){
      console.log(err);
      res.json([]);
    }
    else {
      res.json(users);
    }
  });
});

module.exports = userRouter;
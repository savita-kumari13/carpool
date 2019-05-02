const express = require('express')
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userRouter = express.Router();
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const config = require('../config')
const User = require('../models/User');

const preferences = {
  smoking: config.smoking.DONT_KNOW,
  pets: config.pets.DONT_KNOW,
  chattiness: config.chattiness.DONT_KNOW,
  music: config.music.DONT_KNOW
}

userRouter.route('/register').post((req, res) => {
  const validateRegister = validateRegisterInput(req.body);
  console.log('validateRegister ? ', validateRegister)
  console.log('status : ', validateRegister.status)

  if(!validateRegister.status) {
    return res.json({status: false, response: {errors: validateRegister.errors}, messages: []});
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
      avatar,
      preferences
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
    console.log('user preference  : ', user_preferences)
    const payload = {
      id: user.id,
      name: user.name,
      phone_number: user.phone_number,
      avatar: user.avatar,
      user_preferences: preferences
    }
    return jwt.sign(payload, config.secretKey, {
      expiresIn: '1 day'
      })
  }).then(token => {
    return res.json({status: true, response: {token: token}, messages: ["You have been registered successfully"]});
  }).catch(err=>{
    return res.json({status: true, response: {}, messages: [err.message]});
  });
});


userRouter.route('/login').post((req, res) => {

  const validateLogin = validateLoginInput(req.body);
  console.log('validateLogin ? ', validateLogin)
  console.log('isValid : ', validateLogin.status)
  if(!validateLogin.status) {
    return res.json({status: false, response: {errors: validateRegister.errors}, messages: []});
  }

  const email = req.body.email;
  const password = req.body.password;
  const payload = {};

  User.findOne({
    email : req.body.email
  }).then(user => {
    if(!user) {
        errors.email = 'User not found'
        throw new Error("User doesn't exists");
    }

    payload.id = user.id;
    payload.name = user.name;
    payload.phone_number = user.phone_number
    payload.avatar = user.avatar
    payload.user_preferences = user.preferences

    return bcrypt.compare(password, user.password)
  }).then(isMatch => {
      if(!isMatch) {
        errors.password = 'Incorrect password';
        throw new Error("Incorrect password");
      }
      return jwt.sign(payload, config.secretKey, {
        expiresIn: '1 day'
    })
  }).then(token => {
    return res.json({status: true, response: {token: token}, messages: ["You have been registered successfully"]});
  }).catch(err => {
    return res.json({status: true, response: {}, messages: [err.message]});
    })
});


userRouter.route('/facebook/register').post((req, res) => {
  console.log('user info : ', req.body)
  const avatar = gravatar.url(req.body.email, {
    s: '200',
    r: 'pg',
    d: 'mm'
});
  const newUser = new User({ 
    name: req.body.name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    avatar,
    preferences
});

  User.findOne({
    email : req.body.email
  }).then(user => {
      if(user) {
        throw new Error('Email already exists');
      }
      return newUser.save()
    }).then(user => {
      const payload = {
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
        avatar: user.avatar,
        user_preferences: preferences
      }
      return jwt.sign(payload, config.secretKey, {
        expiresIn: '1 day'
        })
    }).then(token => {
      console.log('token : ', token)
      return res.json({status: true, response: {token: token}, messages: ["You have been registered successfully"]});
  }).catch(err=>{
    return res.json({status: true, response: {}, messages: [err.message]});
  }); 
})

userRouter.route('/facebook/login').post((req, res) => {
  console.log('user info : ', req.body)
  const payload = {}
  User.findOne({
    email : req.body.email
  }).then(user => {
    if(!user) {
        errors.email = 'User not found'
        throw new Error("User doesn't exists");
    }
    payload.id = user.id;
    payload.name = user.name;
    payload.phone_number = user.phone_number
    payload.avatar = user.avatar
    payload.user_preferences = user.preferences

    return jwt.sign(payload, config.secretKey, {
      expiresIn: '1 day'
    })
  }).then(token => {
    console.log('token : ', token)
    return res.json({status: true, response: {token: token}, messages: ["You have been registered successfully"]});
  }).catch(err => {
    return res.json({status: true, response: {}, messages: [err.message]});
    }) 
})


userRouter.route('/auth').post(passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log("Success! You can not see this without a token auth")
  // console.log('res : ', res)
  return res.json({status: true, response: {}, messages: []})
});




userRouter.route('/').get(function (req, res) {
    console.log('Got the listing request')
    User.findOne({
      email: req.body.email
    }).then(user => {
      console.log('currently logged: ', email)
    }).catch(err => {
      console.log('errorrrrrrrr', err)
    })
});

module.exports = userRouter;
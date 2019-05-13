const express = require('express')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userRouter = express.Router();
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateChangePasswordInput = require('../validation/change_password')
const config = require('../config')
const User = require('../models/User');
const multer = require('multer');
var nodemailer = require('nodemailer');
const crypto = require('crypto');

const date = Date.now()
var storage = multer.diskStorage({
  destination: './upload/profile_photo',
  filename: function(req, file, cb){
    cb(null, date + '-' + file.originalname)
  }
})
var upload = multer({ storage: storage })

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
    return res.json({
      status: false,
      response: {errors: validateRegister.errors},
      messages: []
    });
  }
  const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      phone_number: req.body.phone_number,
      avatar: config.profile,
      bio: '',
      preferences,
      // car: {}
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
    const payload = {
      id: user.id,
      name: user.name,
      phone_number: user.phone_number,
      user_preferences: user.preferences,
    }
    return jwt.sign(payload, config.secretKey, {
      expiresIn: '1 day'
      })
  }).then(token => {
    return res.json({
      status: true,
      response: {token: token},
      messages: ["You have been registered successfully"]
    });
  }).catch(err=>{
    return res.json({
      status: true,
      response: {},
      messages: [err.message]
    });
  });
});


userRouter.route('/login').post((req, res) => {
  const validateLogin = validateLoginInput(req.body);
  console.log('validateLogin ? ', validateLogin)
  console.log('isValid : ', validateLogin.status)
  if(!validateLogin.status) {
    return res.json({
      status: false,
      response: {errors: validateLogin.errors},
      messages: []
    });
  }
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
    return res.json({
      status: true,
      response: {token: token},
      messages: ["You have been registered successfully"]
    });
  }).catch(err => {
    return res.json({
      status: true,
      response: {},
      messages: [err.message]
    });
  })
});


userRouter.route('/facebook/register').post((req, res) => {
  const newUser = new User({ 
    name: req.body.name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    avatar: config.profile,
    preferences,
    bio: '',
    car: {}
});

  User.findOne({
    email : req.body.email
  })
  .then(user => {
    if(user) {
      throw new Error('Email already exists');
    }
    return newUser.save()
  })
  .then(user => {
    const payload = {
      id: user.id,
      name: user.name,
      phone_number: user.phone_number,
      user_preferences: user.preferences,
    }
    return jwt.sign(payload, config.secretKey, {
      expiresIn: '1 day'
    })
  })
  .then(token => {
    return res.json({
      status: true,
      response: {token: token},
      messages: ["You have been registered successfully"]
    });
  })
  .catch(err=>{
    return res.json({
      status: true,
      response: {},
      messages: [err.message]
    });
  }); 
})

userRouter.route('/facebook/login').post((req, res) => {
  const payload = {}
  User.findOne({
    email : req.body.email
  })
  .then(user => {
    if(!user) {
        errors.email = 'User not found'
        throw new Error("User doesn't exists");
    }
    payload.id = user.id;
    payload.name = user.name;
    payload.phone_number = user.phone_number
    payload.user_preferences = user.preferences

    return jwt.sign(payload, config.secretKey, {
      expiresIn: '1 day'
    })
  })
  .then(token => {
    return res.json({
      status: true,
      response: {token: token},
      messages: ["You have been registered successfully"]
    });
  })
  .catch(err => {
    return res.json({
      status: true,
      response: {},
      messages: [err.message]});
    }) 
})


userRouter.get('/auth', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log("Success! You can not see this without a token auth")
  return res.json({
    status: true,
    response: {},
    messages: []
  })
});

userRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Success! You can not see this without a token (get current user)')
    User.findById(mongoose.Types.ObjectId(req.user._id))
    .then(user => {
      return res.json({
        status: true,
        response: {
          user: user
        },
        messages: ["Got current user"]
      });
    })
    .catch(err => {
      return res.json({
        status: true,
        response: {},
        messages: [err.message]});
      }) 
});

userRouter.get('/get_profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Success! You can not see this without a token (profile)')
    User.findById(mongoose.Types.ObjectId(req.user._id))
    .then(user => {
      return res.json({
        status: true,
        response: {
          user: user
        },
        messages: ["Got current user profile"]
      });
    })
    .catch(err => {
      return res.json({
        status: true,
        response: {},
        messages: [err.message]});
      }) 
});

userRouter.post('/add_car', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Success! You can not see this without a token (add_car)')
  User.findById(mongoose.Types.ObjectId(req.user._id))
  .then(user => {
    user.cars.push(
      {
        make: req.body.make,
        model: req.body.model,
        type: req.body.type,
        color: req.body.color,
        registered_year: req.body.registered_year
      }
    )
    return user.save()
  })
  .then(user => {
    return res.json({
      status: true,
      response: {
        user: user
      },
      messages: ["Car added successfully"]
    });
  })
  .catch(err => {
    return res.json({
      status: true,
      response: {},
      messages: [err.message]
    });
  }) 
})

userRouter.get('/has_car', passport.authenticate('jwt', { session: false }), (req, res) => {
  User.findById(mongoose.Types.ObjectId(req.user._id))
  .then(user => {
    return res.json({
      status: true,
      response:{
        cars: user.cars
      },
      messages: ["Cars found"]
    })
  })
  .catch((err)=>{
    return res.json({
        status: false,
        response:{},
        messages: [err.message]
    })
  })
})


userRouter.post('/delete_car', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Success! You can not see this without a token (delete car)')

  User.findById(mongoose.Types.ObjectId(req.user._id))
  .then(user => {
    let carId = null
    user.cars.forEach((car, index) => {
      if(car.make == req.body.make &&  car.model ==  req.body.model && car.type == req.body.type && car.color == req.body.color && 
        car.registered_year == req.body.registered_year){
          carId = car._id
          return 
        }   
    })
    return carId
    })
    .then(carId => {
      User.findById(mongoose.Types.ObjectId(req.user._id))
      .then(user => {
        user.cars.pull({
          _id: mongoose.Types.ObjectId(carId)   
        })     
        user.markModified('cars')
        return user.save();
      })
      .then((user)=>{
        return res.json({
            status: true,
            response:{},
            messages: ["Car deleted"]
        })
    })
    .catch((err)=>{
      return res.json({
          status: false,
          response:{},
          messages: [err.message]
      })
    })
  })
  .catch(err => {
    return res.json({
      status: false,
      response:{},
      messages: [err.message]
    })
  })
})

var profileImgUpload=upload.single('image');
userRouter.post('/add_profile_photo', passport.authenticate('jwt', { session: false }),profileImgUpload, (req, res) => {
  console.log('Success! You can not see this without a token (add profile photo)')
  // console.log('req image name ', req.body.data._parts[1][1].name )

  User.findById(mongoose.Types.ObjectId(req.user._id))
  .then(user => {
    user.avatar = date +'-'+ req.file.originalname
    return user.save()
  })
  .then(user => {
    return res.json({
      status: true,
      response: {
        user: user
      },
      messages: ["Profile photo changed"]
    });
  })
  .catch(err => {
    return res.json({
      status: true,
      response: {},
      messages: [err.message]
    });
  })
})

userRouter.post('/update_profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Success! You can not see this without a token (update profile)')
  User.findById(mongoose.Types.ObjectId(req.user._id))
  .then(user => {
    user.name = req.body.name,
    user.phone_number = req.body.phone_number,
    user.bio = req.body.bio
    return user.save()
  })
  .then(user => {
    return res.json({
      status: true,
      response: {
        user: user
      },
      messages: ["Profile updated"]
    });
  })
  .catch(err => {
    return res.json({
      status: true,
      response: {},
      messages: [err.message]
    });
  })
})

userRouter.post('/save_preferences', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Success! You can not see this without a token (save preferences)')
  User.findById(mongoose.Types.ObjectId(req.user._id))
  .then(user => {
    user.preferences.chattiness = req.body.chattiness
    user.preferences.smoking = req.body.smoking
    user.preferences.music = req.body.music
    user.preferences.pets = req.body.pets
    return user.save()
  })
  .then(user => {
    return res.json({
      status: true,
      response: {},
      messages: ["Preferences saved"]
    });
  })
  .catch(err => {
    return res.json({
      status: true,
      response: {},
      messages: [err.message]
    });
  })
})

userRouter.post('/change_password', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Success! You can not see this without a token (change password)')
  const validateChangePassword = validateChangePasswordInput(req.body);
  let currentUser
  User.findById(mongoose.Types.ObjectId(req.user._id))
  .then(user => {
    currentUser = user
    return bcrypt.compare(req.body.current_password, user.password)
  })
  .then(isMatch => {
    if(!isMatch){
      validateChangePassword.errors.current_password = 'Please enter correct password'
      validateChangePassword.status = false
      if(!validateChangePassword.status) {
        return res.json({
          status: false,
          response: {errors: validateChangePassword.errors},
          messages: []
        });
      }
    }
    return bcrypt.genSalt(10);
  })
  .then(salt=>{
    return bcrypt.hash(req.body.new_password, salt);
  })
  .then(hash=>{
      currentUser.password = hash
      if(!validateChangePassword.status) {
        return res.json({
          status: false,
          response: {errors: validateChangePassword.errors},
          messages: []
        });
      }
      return currentUser.save();
    })
    .then(user => {
      return res.json({
        status: true,
        response: {},
        messages: ["Password changed successfully"]
      });
    })
    .catch(err => {
      console.log('user not found', err)
      return res.json({
        status: true,
        response: {},
        messages: [err.message]
      });
    })
})

module.exports = userRouter;
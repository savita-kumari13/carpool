const express = require('express')
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const userRouter = express.Router();
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateChangePasswordInput = require('../validation/change_password')
const validatePhoneNumberInput = require('../validation/phone_number')
const config = require('../config')
const User = require('../models/User');
const Ride = require('../models/Ride')
const multer = require('multer');
const axios = require('axios')
const fs = require('fs')
const path = require('path')

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

userRouter.route('/save_device_token').post((req, res) => {
  User.findOne({
    email: req.body.email
  })
  .then(user => {
    user.device_token = req.body.device_token
    return user.save()
  })
  .then(user => {
    return res.json({
      status: true,
      response: {user: user},
      messages: ["Device token changed successfully"]
    });
  })
  .catch(err=>{
      return res.json({
        status: false,
        response: {},
        messages: [err.message]
      });    
  });
})

userRouter.route('/register').post((req, res) => {
  const validateRegister = validateRegisterInput(req.body);

  if(!validateRegister.status) {
    return res.json({
      status: false,
      response: {errors: validateRegister.errors},
      messages: []
    });
  }
  const newUser = new User({
      name: req.body.name,
      email: (req.body.email.toLowerCase()),
      password: req.body.password,
      phone_number: req.body.phone_number,
      avatar: config.profile,
      bio: '',
      preferences,
      device_token: req.body.device_token
      // car: {}
  });

  User.findOne({
    email : req.body.email.toLowerCase()
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
        status: false,
        response: {},
        messages: [err.message]
      });    
  });
});


userRouter.route('/login').post((req, res) => {
  console.log('body ', req.body)
  const validateLogin = validateLoginInput(req.body);
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
    email : req.body.email.toLowerCase()
  })
  .then(user => {
    if(!user) {
        throw new Error("User doesn't exists");
    }
    payload.id = user.id;
    payload.name = user.name;
    payload.phone_number = user.phone_number
    payload.user_preferences = user.preferences

    user.device_token = req.body.device_token
    return user.save()
  })
  .then(user => {
    return bcrypt.compare(password, user.password)
  })
  .then(isMatch => {
    if(!isMatch) {
      throw new Error("Incorrect password");
    }
    return jwt.sign(payload, config.secretKey, {
      expiresIn: '1 day'
    })
  })
  .then(token => {
    return res.json({
      status: true,
      response: {token: token},
      messages: ["You have been logged in successfully"]
    });
  })
  .catch(err=>{
    return res.json({
      status: false,
      response: {},
      messages: [err.message]
    });    
  });
})


userRouter.route('/facebook/register').post((req, res) => {
  console.log('body ', req.body)
  const validatePhoneNumber = validatePhoneNumberInput(req.body);
  console.log('validatePhoneNumber ? ', validatePhoneNumber)
  if(!validatePhoneNumber.status) {
    return res.json({
      status: false,
      response: {errors: validatePhoneNumber.errors},
      messages: []
    });
  }
  const email = req.body.email.replace(/^"(.*)"$/, '$1')
  const fb_profile_name = date + '-' + email + '.jpg'
  User.findOne({
    email : req.body.email
  })
  .then(async (user) => {
    if(user) {
      throw new Error('Email already exists');
    }
    const url = req.body.avatar
    const image_path = path.resolve(__dirname, '../upload/profile_photo', fb_profile_name)
    const axios_response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream'
    })
    axios_response.data.pipe(fs.createWriteStream(image_path))

    return new Promise((resolve, reject) => {
      axios_response.data.on('end', () => {
        resolve()
      })
      axios_response.data.on('error', () => {
        reject(err)
      })
    })
  }).then(() => {
    console.log('download finished')
    const newUser = new User({ 
      name: req.body.name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      avatar: fb_profile_name,
      preferences,
      device_token: req.body.device_token,
      bio: '',
      car: {}
  });
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
    console.log('errrrr', err)
    return res.json({
      status: false,
      response: {},
      messages: [err.message]
    });
  }); 
})

userRouter.route('/facebook/login').post((req, res) => {
  console.log('body ', req.body)
  const payload = {}
  User.findOne({
    email : req.body.email
  })
  .then(user => {
    if(!user) {
      throw new Error("User doesn't exists");
    }
    payload.id = user.id;
    payload.name = user.name;
    payload.phone_number = user.phone_number
    payload.user_preferences = user.preferences

    user.device_token = req.body.device_token
    return user.save()
  })
  .then(user => {
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
    console.log('errrr ', err)
    return res.json({
      status: false,
      response: {},
      messages: [err.message]
    });
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
        status: false,
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
        status: false,
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
      status: false,
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
  const image_name = date +'-'+ req.file.originalname
  let currentUser
  let previous_photo
  User.findById(mongoose.Types.ObjectId(req.user._id))
  .then(user => {
    previous_photo = user.avatar
    const image_path = path.resolve(__dirname, '../upload/profile_photo', previous_photo)
    fs.unlink(image_path, (err) => {
      if(err) throw err;
    })
    user.avatar = image_name
    return user.save()
  })
  .then(user => {
    currentUser = user
    Ride.find({
      "offered_user._id": mongoose.Types.ObjectId(req.user._id),
      "offered_user.status": {$ne: config.status.COMPLETED}
    })
    .then(rides => {
      rides.forEach((ride, index) => {
        ride.offered_user.avatar = image_name
        return ride.save()
      })
      return rides
    })
    .then(rides => {
      Ride.find({
       "booked_user._id": mongoose.Types.ObjectId(req.user._id),
       "booked_user.status": {$ne: config.status.COMPLETED}
      })
      .then(rides => {
        rides.forEach((ride, index) => {
          ride.booked_user.forEach((user,index)=>{
            if(user._id.toString() == req.user._id){
              user.avatar= image_name
              ride.markModified('booked_user')
              return ride.save();
            }
          })
          return rides
        })
        return rides
      })
      .then(rides => {
        console.log('updated')
        return
      })
      return
    })
    return res.json({
      status: true,
      response: {
        user: currentUser
      },
      messages: ["Profile photo changed"]
    })
  })
  .catch(err => {
    return res.json({
      status: false,
      response: {},
      messages: [err.message]
    });
  })
})

userRouter.post('/update_profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Success! You can not see this without a token (update profile)')
  let currentUser
  User.findById(mongoose.Types.ObjectId(req.user._id))
  .then(user => {
    user.name = req.body.name,
    user.phone_number = req.body.phone_number,
    user.bio = req.body.bio
    return user.save()
  })
  .then(user => {
    currentUser = user
    Ride.find({
      "offered_user._id": mongoose.Types.ObjectId(req.user._id),
      "offered_user.status": {$ne: config.status.COMPLETED}
    })
    .then(rides => {
      rides.forEach((ride, index) => {
        ride.offered_user.name = req.body.name,
        ride.offered_user.phone_number = req.body.phone_number,
        ride.offered_user.bio = req.body.bio
        return ride.save()
      })
      return rides
    })
    .then(rides => {
      Ride.find({
       "booked_user._id": mongoose.Types.ObjectId(req.user._id),
       "booked_user.status": {$ne: config.status.COMPLETED}
      })
      .then(rides => {
        rides.forEach((ride, index) => {
          ride.booked_user.forEach((user,index)=>{
            if(user._id.toString() == req.user._id){
              user.name= req.body.name,
              user.phone_number = req.body.phone_number,
              user.bio = req.body.bio
              ride.markModified('booked_user')
              return ride.save();
            }
          })
          return rides
        })
        return rides
      })
      .then(rides => {
        console.log('updated profile')
        return
      })
      return
    })
    return res.json({
      status: true,
      response: {},
      messages: ["Profile updated"]
    });
  })
  .catch(err => {
    return res.json({
      status: false,
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
    currentUser = user
    Ride.find({
      "offered_user._id": mongoose.Types.ObjectId(req.user._id),
      "offered_user.status": {$ne: config.status.COMPLETED}
    })
    .then(rides => {
      rides.forEach((ride, index) => {
        ride.offered_user.preferences.chattiness = req.body.chattiness,
        ride.offered_user.preferences.smoking = req.body.smoking,
        ride.offered_user.preferences.music = req.body.music
        ride.offered_user.preferences.pets= req.body.pets
        return ride.save()
      })
      return rides
    })
    .then(rides => {
      Ride.find({
       "booked_user._id": mongoose.Types.ObjectId(req.user._id),
       "booked_user.status": {$ne: config.status.COMPLETED}
      })
      .then(rides => {
        rides.forEach((ride, index) => {
          ride.booked_user.forEach((user,index)=>{
            if(user._id.toString() == req.user._id){
              user.preferences.chattiness = req.body.chattiness,
              user.preferences.smoking = req.body.smoking,
              user.preferences.music = req.body.music
              user.preferences.pets= req.body.pets
              ride.markModified('booked_user')
              return ride.save();
            }
          })
          return rides
        })
        return rides
      })
      .then(rides => {
        console.log('updated preferences')
        return
      })
      return
    })
    return res.json({
      status: true,
      response: {},
      messages: ["Preferences saved"]
    });
  })
  .catch(err => {
    return res.json({
      status: false,
      response: {},
      messages: [err.message]
    });
  })
})

userRouter.post('/change_password', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log('Success! You can not see this without a token (change password)')
  const validateChangePassword = validateChangePasswordInput(req.body);
  if(!validateChangePassword.status) {
    return res.json({
      status: false,
      response: {errors: validateChangePassword.errors},
      messages: []
    });
  }
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
        status: false,
        response: {},
        messages: [err.message]
      });
    })
})

module.exports = userRouter;
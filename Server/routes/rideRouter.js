const express = require('express')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose')
const rideRouter = express.Router();
const config = require('../config')

const Ride = require('../models/Ride');
const User = require('../models/User');

var fcm = require('fcm-notification');
var FCM = new fcm('../Server/private_key.json');


rideRouter.post('/offer_ride', passport.authenticate('jwt', { session: false }),(req, res) => {
    console.log("Success! You can not see this without a token (offer ride)")
    User.findById(mongoose.Types.ObjectId(req.user._id))
    .then(user => {
        console.log('avatar',user.avatar)
        console.log('bio', user.bio)
        const newRide = new Ride({
            pick_up_name: req.body.pick_up_name,
            pick_up_coordinates:{
                type: 'Point',
                coordinates: [ req.body.pick_up_coordinates[0], req.body.pick_up_coordinates[1]]
            },
            drop_off_name: req.body.drop_off_name,
            drop_off_coordinates:{
                type: 'Point',
                coordinates: [req.body.drop_off_coordinates[0], req.body.drop_off_coordinates[1]]
            },
            offered_ride_passengers_no: req.body.offered_ride_passengers_no,
            offered_ride_price: req.body.offered_ride_price,
            offered_ride_info: req.body.offered_ride_info,
            offered_ride_date_time: req.body.offered_ride_date_time,
            offered_user: {
                _id: req.user._id,
                name: req.user.name,
                phone_number: req.user.phone_number,
                preferences: req.user.preferences,
                status: config.status.PENDING,
                avatar: user.avatar,
                car: req.body.offered_ride_car,
                bio: user.bio
            },
        })       
        return newRide.save()
    }).then((newRide) => {
        return res.json({
            status: true,
            response:{
                rides: newRide
            },
            messages: ["Ride saved"]  
        }) 
    }).catch(err => {
        console.log('error saving ride', err)
        return res.json({
            status: false,
            response:{},
            messages: [err.message]  
        }) 
    })
})

rideRouter.post('/search_ride', passport.authenticate('jwt', { session: false}), (req, res) => {
    console.log('Success! You can not see this without a token (search ride)')
    Ride.find({
        pick_up_coordinates: {
            $geoWithin: {
                $centerSphere: [[req.body.leaving_from_coordinates[0], req.body.leaving_from_coordinates[1]], 0.310686/3963.2 ]
            }
        }
        ,drop_off_coordinates: {
            $geoWithin: {
                $centerSphere: [[req.body.going_to_coordinates[0], req.body.going_to_coordinates[1]], 0.310686/3963.2 ]
            }
        }
        ,offered_ride_date_time: {
            $gte: new Date(Date.parse(req.body.searched_ride_date_time) - 1 * 60 * 60 * 1000),
            $lte: new Date(Date.parse(req.body.searched_ride_date_time) + 1 * 60 * 60 * 1000)
        }
        ,offered_ride_passengers_no: { $gt : 0}
    },
    {
        pick_up_coordinates: 0, drop_off_coordinates: 0, "offered_user._id": 0
    })
    .then(rides => {
        return res.json({
            status: true,
            response:{
                rides: rides
            },
            messages: ["Matched rides"]     
        })     
    })
    .catch(err => {
        console.log('error in searching rides ', err)
        return res.json({
            status: false,
            response:{},
            messages: [err.message]  
        }) 
    })
})


rideRouter.post('/book', passport.authenticate('jwt', { session : false }), (req, res) => {
    console.log('Success! You can not see this without a token (book ride)')
    let id = mongoose.Types.ObjectId(req.body.ride_id)
    let deviceToken
    let currentUser
    let currentRide
    if(!mongoose.Types.ObjectId.isValid(id)) {
        console.log('Not valid');
        return res.json({
            status: false,
            response:{},
            messages: ['Provide correct key']
        });
    }
  User.findById(mongoose.Types.ObjectId(req.user._id))
    .then(user => {
      currentUser = user
      Ride.findById(id)
      .then(ride=>{
        ride.offered_ride_passengers_no= ride.offered_ride_passengers_no - req.body.seats_booked;
        let existUser=false;
        ride.booked_user.forEach((user,index)=>{
          if(user._id.toString() == req.user._id){
            existUser=true;
            ride.booked_user[index].seats_booked= user.seats_booked + req.body.seats_booked
            ride.markModified('booked_user')
            return ;
          }
        })
        if(!existUser){
          ride.booked_user.push(
            {
              _id: mongoose.Types.ObjectId(req.user._id),
              name: req.user.name,
              phone_number: req.user.phone_number,
              preferences: req.user.preferences,
              seats_booked: req.body.seats_booked,
              status: config.status.PENDING,
              avatar: user.avatar,
              bio: user.bio
            }
          )
        }
        return ride.save(); 
      })
      .then((ride)=>{
        currentRide = ride
        let userId = ride.offered_user._id
        return userId
      })
      .then(userId => {
          User.findById(mongoose.Types.ObjectId(userId))
          .then(user => {
            deviceToken = user.device_token
            return deviceToken
          })
          .then(deviceToken => {
            let seats = ' seats'
            if(req.body.seats_booked == 1){
                seats = ' seat'
            }
            var message = {
                // data: {    //This is only optional, you can send any data
                //     score: '850',
                //     time: '2:45'
                // },
                notification:{
                    title : 'CarPool',
                    body : user.name + ' has booked ' + req.body.seats_booked + seats + ' for your ride ' + currentRide.pick_up_name + ' - ' + currentRide.drop_off_name
                },
                token : deviceToken
            };
            console.log(message);
            FCM.send(message, (err, response) => {
                if(err) {
                    console.log('error in sending notification ', err)
                    throw err
                }
                console.log('notification ', response)
                console.log('sjafiiw')
            })
            return
          })
          return
      })
      .then(() => {
        return res.json({
          status: true,
          response:{
            ride: currentRide
          },
          messages: ["Booked ride"]
        })
      })
      return
    })
    .catch((err)=>{
      console.log('errrrrr', err)
      return res.json({
          status: false,
          response:{},
          messages: [err.message]
      })
    })
  })


rideRouter.get('/current_offered_ride', passport.authenticate('jwt', { session : false }), (req,res) =>{
    Ride.find({
        "offered_user._id": mongoose.Types.ObjectId(req.user._id),
        "offered_user.status": {$ne: config.status.COMPLETED}
    },
    {
        pick_up_coordinates: 0, drop_off_coordinates: 0, "offered_user._id": 0
    }).then((rides) => {
        return res.json({
            status: true,
            response:{
                rides: rides
            },
            messages: ["Current offered ride"]
        })
    }).catch((err) => {
        return res.json({
            status: false,
            response:{},
            messages: [err.message]
        })
    })
})

rideRouter.post('/start', passport.authenticate('jwt', { session : false }), (req, res) => {
    Ride.findOne({
        _id:  mongoose.Types.ObjectId(req.body.ride_id)
    }).then(ride => {
        ride.offered_user.status = config.status.ON_GOING
        ride.booked_user.forEach((user, index) => {
            user.status = config.status.ON_GOING
        })
        ride.markModified('booked_user')
        return ride.save();
    }).then((ride)=>{
        return res.json({
            status: true,
            response:{
                ride: ride
            },
            messages: ["Ride Started"]
        })
    }).catch((err)=>{
        return res.json({
            status: false,
            response:{},
            messages: [err.message]
        })
    })
})

rideRouter.post('/cancel_offered_ride', passport.authenticate('jwt', { session : false }), (req, res) =>{
    Ride.findByIdAndRemove(mongoose.Types.ObjectId(req.body.ride_id))
    .then((ride)=>{
        return res.json({
            status: true,
            response:{},
            messages: ["Ride Cancelled"]
        })
    }).catch((err)=>{
        return res.json({
            status: false,
            response:{},
            messages: [err.message]
        })
    })
})

rideRouter.post('/offered_ride_completed', passport.authenticate('jwt', { session : false }), (req, res) =>{
    Ride.findOne({
        _id:  mongoose.Types.ObjectId(req.body.ride_id)
    }).then(ride => {
        ride.offered_user.status = config.status.COMPLETED
        ride.booked_user.forEach((user, index) => {
            user.status = config.status.COMPLETED
        })
        ride.markModified('booked_user')
        return ride.save();
    }).then((ride)=>{
        return res.json({
            status: true,
            response:{},
            messages: ["Ride Completed"]
        })
    }).catch((err)=>{
        return res.json({
            status: false,
            response:{},
            messages: [err.message]
        })
    })
})

rideRouter.get('/current_searched_ride', passport.authenticate('jwt', { session : false }), (req,res) =>{
    Ride.find({
        booked_user:{
                $elemMatch: {
                    _id: mongoose.Types.ObjectId(req.user._id),
                    status: {$ne: config.status.COMPLETED}
                }
        }
    },
    {
        pick_up_coordinates: 0, drop_off_coordinates: 0, "offered_user._id": 0
    }).then((rides) => {
        return res.json({
            status: true,
            response:{
                rides: rides
            },
            messages: ["Current booked ride"]
        })
    }).catch((err) => {
        return res.json({
            status: false,
            response:{},
            messages: [err.message]
        })
    })
})

rideRouter.post('/cancel_booked_ride',  passport.authenticate('jwt', { session : false }), (req, res) => {
    Ride.findOne({
        _id:  mongoose.Types.ObjectId(req.body.ride_id)
    }).then(ride => {
        let seatsBooked = 0;
        ride.booked_user.forEach((user, index) => {
            if(user._id.toString() == req.user._id){
                seatsBooked = user.seats_booked
            }
        })
        ride.offered_ride_passengers_no= ride.offered_ride_passengers_no + seatsBooked;
        ride.booked_user.pull({
                _id:  mongoose.Types.ObjectId(req.user._id)    
        })     
        ride.markModified('booked_user')
        return ride.save();
    }).then((ride)=>{
        return res.json({
            status: true,
            response:{},
            messages: ["Ride Cancelled"]
        })
    }).catch((err)=>{
        return res.json({
            status: false,
            response:{},
            messages: [err.message]
        })
    })
})

rideRouter.post('/booked_ride_completed', passport.authenticate('jwt', { session : false }), (req, res) => {
    Ride.findOne({
        _id:  mongoose.Types.ObjectId(req.body.ride_id)
    }).then(ride => {
        ride.booked_user.forEach((user, index) => {
            user.status = config.status.COMPLETED
        })
        ride.markModified('booked_user')
        return ride.save();
    }).then((ride)=>{
        return res.json({
            status: true,
            response:{},
            messages: ["Ride Completed"]
        })
    }).catch((err)=>{
        return res.json({
            status: false,
            response:{},
            messages: [err.message]
        })
    })
})

rideRouter.get('/history_offered_ride', passport.authenticate('jwt', { session : false }), (req,res) =>{
    Ride.find({
        "offered_user._id": mongoose.Types.ObjectId(req.user._id),
        "offered_user.status": config.status.COMPLETED
    },
    {
        pick_up_coordinates: 0, drop_off_coordinates: 0, "offered_user._id": 0
    }).then((rides) => {
        return res.json({
            status: true,
            response:{
                rides: rides
            },
            messages: ["History offered ride"]
        })
    }).catch((err) => {
        return res.json({
            status: false,
            response:{},
            messages: [err.message]
        })
    })
})

rideRouter.get('/history_searched_ride', passport.authenticate('jwt', { session : false }), (req,res) =>{
    Ride.find({
        booked_user:{
            $elemMatch: {
                _id: mongoose.Types.ObjectId(req.user._id),
                status: {$in: [config.status.COMPLETED, config.status.CANCELLED]}
            }
        }
    },
    {
        pick_up_coordinates: 0, drop_off_coordinates: 0, "offered_user._id": 0
    })
    .then((rides) => {
        return res.json({
            status: true,
            response:{
                rides: rides
            },
            messages: ["History searched ride"]
        })
    })
    .catch((err) => {
        return res.json({
            status: false,
            response:{},
            messages: [err.message]
        })
    })
})

module.exports = rideRouter;

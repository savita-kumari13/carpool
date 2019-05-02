const express = require('express')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const mongoose = require('mongoose')
const rideRouter = express.Router();
const config = require('../config')

const Ride = require('../models/Ride');
const User = require('../models/User');

rideRouter.post('/offer_ride', passport.authenticate('jwt', { session: false }),(req, res) => {
    console.log("Success! You can not see this without a token (offer ride)")
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
            preferences: req.user.preferences
        },
        booked: {}
    });
    newRide.save().then(() => console.log('ride saved successfuly')).catch(err => console.log('error saving ride', err))
    // return res.json(newRide)
    return res.json({
        status: true,
        response:{
            rides: newRide
        },
        messages: ["Ride saved"]
        
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

    },
    {
        pick_up_coordinates: 0, drop_off_coordinates: 0, "offered_user._id": 0
    })
    .then(rides => {
        // console.log('locations found : ', rides) 
        return res.json({
            status: true,
            response:{
                rides: rides
            },
            messages: ["Matched rides"]
            
        })     
    })
    .catch(err => console.log('error in geoWithin, centerSphere : ', err))
})


rideRouter.post('/book', passport.authenticate('jwt', { session : false }), (req, res) => {
    console.log('Success! You can not see this without a token (book ride)')
    let id = mongoose.Types.ObjectId(req.body.ride_id)

    if(mongoose.Types.ObjectId.isValid(id)) {
        Ride.findById(id).then(ride=>{
            ride.offered_ride_passengers_no= ride.offered_ride_passengers_no - req.body.seats_booked;
            let existUser=false;
            ride.booked_user.forEach((user,index)=>{
                if(user._id.toString()== req.user._id){
                    existUser=true;
                    ride.booked_user[index].seats_booked= user.seats_booked + req.body.seats_booked
                    ride.markModified('booked_user')
                    return ;
                }
            });
            if(!existUser){
                ride.booked_user.push(
                    {
                        _id: mongoose.Types.ObjectId(req.user._id),
                        name: req.user.name,
                        phone_number: req.user.phone_number,
                        preferences: req.user.preferences,
                        seats_booked: req.body.seats_booked
                    }
                )
            }
            return ride.save(); 
        })
        .then((rides)=>{
            if(rides) {
            //  resolve({success:true,data:docs});
            console.log('ride booked : ', rides) 
            return res.json({
                status: true,
                response:{
                    rides: rides
                },
                messages: ["Booked ride"]
                
            })
           } else {
             reject({success:false,data:"no such user exist"});
           }
        }).catch((err)=>{
            reject(err);
        })
        } else {
          reject({success:"false",data:"provide correct key"});
        }
    })


    rideRouter.get('/current_ride', passport.authenticate('jwt', { session : false }), (req,res) =>{
        console.log('Success! You can not see this without a token (current ride)')
        console.log(req.user)
        Ride.find({
            booked_user:{
                    $elemMatch: {_id: mongoose.Types.ObjectId(req.user._id)}
            }
        },
        {
            pick_up_name: 1, drop_off_name: 1, offered_ride_date_time: 1, offered_user: 1, booked_user: 1
        }).then((rides) => {
            console.log('ride found for booked user ', rides)
            return res.json({
                status: true,
                response:{
                    rides: rides
                },
                messages: ["Booked ride"]
            })
        }).catch((err) => {
            console.log('error getting booked rides')
            reject(err);
        })
    })

    rideRouter.post('/cancel_or_completed',  passport.authenticate('jwt', { session : false }), (req, res) => {
        console.log('Success! You can not see this without a token (cancel ride)')
        console.log(req.body)
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
        }).then((rides)=>{
            if(rides) {
            console.log('ride cancelled : ', rides) 
            return res.json({
                status: true,
                response:{
                    rides: rides
                },
                messages: ["Ride Cancelled"]
                
            })
           } else {
             reject({success:false,data:"no such user exist"});
           }
        }).catch((err)=>{
            console.log("error in cancelling ride ", err)
            reject(err);
        })
    })
module.exports = rideRouter;

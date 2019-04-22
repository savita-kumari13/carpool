const express = require('express')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const rideRouter = express.Router();

const Ride = require('../models/Ride');
const User = require('../models/User');

rideRouter.post('/offer_ride', passport.authenticate('jwt', { session: false }),(req, res) => {
    console.log("Success! You can not see this without a token (offer ride)")
    console.log('user id : ', req.user._id)
    console.log(' longitude pickup : ', req.body.pick_up_coordinates[0])
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
        user: {
            _id: req.user._id,
            name: req.user.name,
            phone_number: req.user.phone_number
        },
    });
    newRide.save().then(() => console.log('ride saved successfuly')).catch(err => console.log('error saving ride', err))
    return res.json(newRide)
})

rideRouter.post('/search_ride', passport.authenticate('jwt', { session: false}), (req, res) => {
    console.log('Success! You can not see this without a token (search ride)')
    console.log('data to search : ', req.body)
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
        pick_up_coordinates: 0, drop_off_coordinates: 0, "user._id": 0
    })
    .then(rides => {
        console.log('locations found : ', rides) 
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


module.exports = rideRouter;

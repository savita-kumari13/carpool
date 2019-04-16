const express = require('express')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const rideRouter = express.Router();

const Ride = require('../models/Ride');

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
        user: req.user._id,
    });
    newRide.save().then(() => console.log('ride saved successfuly')).catch(err => console.log('error saving ride', err))
    return res.json(newRide)
})

rideRouter.post('/search_ride', passport.authenticate('jwt', { session: false}), (req, res) => {
    console.log('Success! You can not see this without a token (search ride)')
    console.log('data to search : ', req.body)
    Ride.find({
        $and: [{
            pick_up_coordinates: {
            $geoWithin: {
                $centerSphere: [[req.body.leaving_from_coordinates[0], req.body.leaving_from_coordinates[1]], 0.310686/3963.2 ]
            }
            } 
        },{
            drop_off_coordinates: {
            $geoWithin: {
                $centerSphere: [[req.body.going_to_coordinates[0], req.body.going_to_coordinates[1]], 0.310686/3963.2 ]
            }
            } 
        },{
           
        }]
    })
    .then(res => {
        console.log('locations found : ', res)
        console.log('day : ', res[0].offered_ride_date_time)
    })
    .catch(err => console.log('error in geoWithin, centerSphere : ', err))
})


module.exports = rideRouter;

// db.inventory.find( { $and: [ { price: { $ne: 1.99 } }, { price: { $exists: true } } ] } )
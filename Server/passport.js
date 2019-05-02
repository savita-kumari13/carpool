const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('./models/User')
const opts = {};
const config = require('./config')

opts.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey,
opts.secretOne = config.secretKey;

module.exports = passport => {
    passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
        console.log('payload received : ', jwt_payload )
        User.findById(jwt_payload.id)
        .then(user => {
            if(user) {
                return done(null, user);
            }
            return done(null, false);
        })
        .catch(err => console.log('error in passport js ', err));
    }));
}

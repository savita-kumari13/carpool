const express = require('express')
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport')
const port = 5570;

const config = require('./config');
const UserRouter = require('./routes/userRouter')
const RideRouter = require('./routes/rideRouter')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false  }));
app.use(bodyParser.json());

mongoose.connect(config.DB, { useNewUrlParser: true }).then(() => {
    console.log('database connected')},
    err => {
        console.log('can not connect ot databse : ', err)
    });

app.use('/users', UserRouter);
app.use('/rides', RideRouter );


require('./passport')(passport);
app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req, res) => {
    res.send('helllllooo reacttt native')
})
app.listen(port, () => {
    console.log(`Listening at ${port}`);
 })
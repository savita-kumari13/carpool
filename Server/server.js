const express = require('express')
const app = express();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport')
const crypto = require('crypto');
const User = require('./models/User');
const config = require('./config');
const UserRouter = require('./routes/userRouter')
const RideRouter = require('./routes/rideRouter')
const ValidateResetPasswordInput = require('./validation/reset_password')
const nodemailer = require('nodemailer');
const fs = require('fs');

app.use(express.static(__dirname + '/upload/profile_photo'));
app.use(express.static(__dirname + '/templates'));
// app.use('/static', express.static(path.join(__dirname, 'upload/profile_photo')))

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

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('view engine', 'ejs');


require('./passport')(passport);
app.use(passport.initialize());
app.use(passport.session());



app.get('/', (req, res) => {
    res.send('helllllooo reacttt native')
})

app.post('/forgot_password', (req, res) => {
    console.log('Success! You can not see this without a token (forgot password)')
    User.findOne({
      email : req.body.email
    })
    .then(user => {
      if(!user)
        throw new Error("User doesn't exists");
        return new Promise(function(resolve,reject){
        crypto.randomBytes(24, (err, buffer) => {
          if (err){
            reject(err);
            return;
          }
          let token = buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
          resolve(token);
        });
      })
      .then(token=>{
        user.token = token
        return user.save()
      })
    })
    .then(user=>{
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: config.gmail.email,
          pass: config.gmail.password
        }
      });
      var htmlBody=fs.readFileSync('./templates/email/reset_password.html',{encoding: 'utf8'});
      htmlBody = htmlBody.replace(/{{app_host}}/g, config.app_host);
      htmlBody = htmlBody.replace(/{{user_token}}/g, user.token);
      var mailOptions = {
        from: config.gmail.email,
        to: req.body.email,
        subject: 'Reset password instructions',
        html: htmlBody
      }; 

      console.log(config.app_host + '/users/reset_password' + '?token=' + user.token)
      return new Promise(function(resolve,reject){
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            reject(error)
          } else {
            resolve(info.response)
          }
        });
      })
    })
    .then(_ => {
      return res.json({
        status: true,
        response: {},
        messages: []
      });
    })
    .catch(err=>{
      return res.json({
        status: false,
        response: {},
        messages: [err.message]
      });
    })   
  })

app.get('/reset_password', (req, res) => {
  User.findOne({
    $and: [{token: {$eq: req.query.token}}, {token:{$ne: null}}, {token: {$ne: ''}}]
    // token: {$eq: req.query.token, $and: [{$ne: null}, {$ne: ''}]},
  })
  .then(user => {
    if(!user) {
      throw new Error("User doesn't exists");
    }
    var errorExist=false;
    if(req.query.errors){
      errorExist = true
    }
    var htmlBody=fs.readFileSync('./templates/confirm_password1.html',{encoding: 'utf8'});
    htmlBody = htmlBody.replace(/{{app_host}}/g, config.app_host);
    htmlBody = htmlBody.replace(/{{user_token}}/g, user.token);
    htmlBody = htmlBody.replace(/{{error_str}}/g, errorExist ? '<div class="alert error alert-danger text-center">Please check fields</div>' : '');
    res.send(htmlBody)
  })
  .catch(err =>{
    res.sendFile('./templates/reset_password_error1.html', {root: __dirname })
  })
})

app.post('/reset_password_success', (req, res) => {
  console.log('body ', req.body)
  const validateResetPassword = ValidateResetPasswordInput(req.body);
  console.log('validateRegister.status ', validateResetPassword.status)
  if(!validateResetPassword.status) {
    return res.redirect('/reset_password?token='+req.body.token+'&errors=1');
  }
  let currentUser
  User.findOne({
    $and: [{token: {$eq: req.body.token}}, {token:{$ne: null}}, {token: {$ne: ''}}]
  })
  .then(user => {
    if(!user) {
      throw new Error("User doesn't exists");
    }
    currentUser = user
    return bcrypt.genSalt(10);
  })
  .then(salt=>{
    return bcrypt.hash(req.body.password, salt);
  }).then(hash=>{
    currentUser.password = hash;
    currentUser.token = ''
    return currentUser.save();
  })
  .then(user => {
    res.sendFile('./templates/reset_password_success1.html', {root: __dirname })
  })
  .catch(err => {
    console.log('err ', err)
    res.sendFile('./templates/reset_password_error1.html', {root: __dirname })
  })
})
  
app.listen(config.port, () => {
    console.log(`Listening at ${config.port}`);
 })
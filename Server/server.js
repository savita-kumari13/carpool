const express = require('express')
const app = express();
const multer = require('multer');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport')
const crypto = require('crypto');
const User = require('./models/User');
const port = 5570;
const config = require('./config');
const UserRouter = require('./routes/userRouter')
const RideRouter = require('./routes/rideRouter')

const nodemailer = require('nodemailer');
const fs = require('fs');

app.use(express.static('upload/profile_photo'));

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
    console.log(req.body)
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
          let token = buffer.toString('base64');
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
      var mailOptions = {
        from: config.gmail.email,
        to: req.body.email,
        subject: 'Reset password instructions',
        text: 'That was easy!',
        // html: '<h1>Welcome</h1><p>Click url </p>' + config.app_host + '/reset_password' + '?token=' + user.token
          html: fs.readFileSync('./emailBody.html',(err, template) => {
            console.log('template ', template)
            template = template.replace('{{app_host}}', config.app_host)
          })

      //   html: '<div class="m_-3826978243865701881webkit" style="max-width:600px;Margin:0 auto">' +
      //   '<table class="m_-3826978243865701881outer" align="center" cellpadding="0" cellspacing="0" border="0" style="border-spacing:0;font-family:gt-eesti,ArialMT,Helvetica,Arial,sans-serif;Margin:0 auto;padding:24px;width:100%;max-width:500px">'+
      //     "<tbody>"+
      //     '<tr>'+
      //       '<td>'+
      //         '<table style="margin-bottom:10px;width:100%" width="100%">'+
      //           '<tbody><tr>'+
      //             '<td>'+
      //               "<img src='http://192.168.43.100:5570/carpool.png' style='display:block' alt='Carpool' width='125' height='125' class='CToWUd'/>"+
      //             '</td>'+
      //           '</tr>'+
      //         '</tbody></table>'+
      //       '</td>'+
      //     '</tr>'+
      //     '<tr>'+
      //       '<td style="text-align:justify;word-break:break-word">'+
      //         '<table style="margin-bottom:20px;width:100%" width="100%">'+
      //           '<tbody>'+
      //             '<tr>'+
      //               '<td>'+
      //                 '<table style="width:110%;margin-bottom:20px" width="100%" cellpadding="0" cellspacing="0">'+
      //                   '<tbody><tr>'+
      //                     '<td>'+
      //                       '<h1 style="font-size:26px;line-height:30px;color:#054752;word-break:normal">You can now change your password. Just click below.</h1>'+
      //                     '</td>'+
      //                   '</tr>'+
      //                 '</tbody></table>'+
      //               '</td>'+
      //             '</tr>'+
      
      //             '<tr>'+
      //               '<td>'+
      //                 '<center>'+
      //                   '<table style="background-color:#fff;margin-bottom:20px;table-layout:fixed" align="center" width="" cellspacing="0" cellpadding="0">'+
      //                     '<tbody>'+
      //                       '<tr>'+
      //                         '<td style="background-color:#7963b6;color:#fff;text-align:center;border-radius:48px;padding:16px 24px;border-color:transparent;font-weight:bold;font-size:16px;line-height:1">'+
      //                           "<a href=" + config.app_host  + '/reset_password' + '?token=' + user.token + 'style="color:#fff;text-decoration:inherit!important" target="_blank" '+">Change my password</a>"+
      //                        '</td>'+
      //                       '</tr>'+
      //                     '</tbody>'+
      //                   '</table>'+
      //                 '</center>'+
      //               '</td>'+
      //             '</tr>'+
      //           '</tbody>'+
      //         '</table>'+
      //       '</td>'+
      //     '</tr>'+
      //     '<tr>'+
      //       '<td>'+
      //         '</td></tr><tr>'+
      //         '<td>'+
      //             '<table width="100%" style="margin-bottom:20px;width:100%">'+
      //                 '<tbody><tr>'+
      //                     '<td width="100%">'+
      //                         '<div style="width:100%;height:1px;background-color:#ddd" color="#DDD" width="100%"></div>'+
      //                     '</td></tr>'+
      //             '</tbody></table>'+
      //         '</td>'+
      //     '</tr>'+
      //   '</tbody></table>'+
      // '</div>'
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
      console.log(err)
      return res.json({
        status: false,
        response: {},
        messages: [err.message]
      });
    })   
  })

app.get('/reset_password', (req, res) => {
  console.log('url ', req.query.token)
  User.findOne({
    token: req.query.token
  })
  .then(user => {
    res.send(
      '<html>' +
    '<head>'+
    '</head>'+
    '<body>'+
      '<div>'+
        '<form class="wrapper small-only:heightMax" method="post">'+
          '<h1 class="kirk-title theVoice">Choose a new password.</h1>'+
          '<div class="jsx-2044813569 kirk-textField">'+
            '<div class="jsx-2044813569 kirk-textField-wrapper">'+
              '<input type="password" placeholder="Password (min. 8 characters)" name="password" autocomplete="new-password" title="Enter new password" class="jsx-2044813569 " value="t" aria-autocomplete="list">'+
              '<button class="kirk-button kirk-button-unstyled kirk-button-bubble kirk-textField-button" type="button" tabindex="-1" aria-hidden="true">'+
                
              '</button>'+
            '</div>'+
          '</div>'+
          '<div class="button-wrapper m-xl justify-center">'+
            '<button class="kirk-button kirk-button-primary" type="submit" title="">Submit your new password</button>'+
          '</div>'+
        '</form>'+
      '</div>'+
    '</body>'+
  '</html>')
  })
  .catch(err =>{

  })
})
  
app.listen(port, () => {
    console.log(`Listening at ${port}`);
 })
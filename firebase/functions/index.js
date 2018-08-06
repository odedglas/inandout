'use strict';

const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const nodemailer = require('nodemailer');
firebase.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const extend = require('extend');

const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const mailgun = require('mailgun-js')({apiKey: "15f66c57ff0f79641658b92b532f5f40-7efe8d73-a4a63df4", domain: "https://api.mailgun.net/v3/sandboxc01f9839f2f74ec2a3ed350ecfe95f7b.mailgun.org"})

const app = express();

const validateFirebaseIdToken = (req, res, next) => {

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))) {

    res.status(403).send('Unauthorized');
    return;
  }

  const idToken = req.headers.authorization.split('Bearer ')[1];
  firebase.auth().verifyIdToken(idToken).then(decodedIdToken => {

    req.user = decodedIdToken;
    next();

  }).catch(error => {
    res.status(403).send('Unauthorized');
  });

};

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);

exports.app = functions.https.onRequest(app);

const APP_NAME = 'In&Out'
app.post('/sendInviteMail', (req, res) => {

  const email = req.body.email;

  console.log("Sending Mail to :" + email);
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
  return mailTransport.sendMail(mailOptions).then(() => {

    res.send({ok: 200})
    return console.log('New welcome email sent to:', email);
  }).catch(e => {

    console.log("Mail Error")
    console.log(e)
  });
});

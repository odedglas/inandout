'use strict';

const functions = require('firebase-functions');
const firebase = require("firebase-admin");
const nodemailer = require('nodemailer');
firebase.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const extend = require('extend');

//App info
const APP_NAME = 'In&Out';
const APP_URL = 'https://inandout-91d34.firebaseapp.com';
const signUpURL = `${APP_URL}/signup`;

//Mail credentials
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});


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


app.post('/sendInviteMail', (req, res) => {

  const email = req.body.email;

  console.log("Sending Mail to :" + email);
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `${APP_NAME} Project share request from to !`;
  mailOptions.html = `
      <div> Hello ! </div> 
      <div> You have been invited to share a project : with </div>
      <div> Please follow this link: <a href=${signUpURL}> In&Out</a> In order to sign up and start working on your projects!</div>`;

  return mailTransport.sendMail(mailOptions).then(() => {

    res.status(200).send({ok: 200});
    return console.log('New welcome email sent to:', email);
  }).catch(e => {

    console.log("Mail Error")
    console.log(e)
    res.status(500).send({error: e});
  });
});

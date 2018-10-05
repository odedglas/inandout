'use strict';
const functions = require('firebase-functions');
const firebase = require("firebase-admin");
firebase.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const mailService = require('./services/mail');
const DBListeners = require('./listeners');

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

app.post('/sendInviteMail', (req, res) => {

  const {email, owner, project} = req.body;

  return mailService.sendInvite(email, owner, project).then(() => {

    res.status(200).send({ok: 200});
    return console.log('New welcome email sent to:', email);
  }).catch(e => {

    console.log("Mail Error");
    console.log(e);
    res.status(500).send({error: e});
  });
});

let transactionPath = '/transactions/{projectKey}/{monthYearKey}/{transactionId}';
exports.transactionCreateListener = functions.database.ref(transactionPath)
  .onCreate(DBListeners.transactionCreate);

exports.transactionDeleteListener = functions.database.ref(transactionPath)
  .onDelete(DBListeners.transactionDelete);

exports.transactionUpdateListener = functions.database.ref(transactionPath)
  .onUpdate(DBListeners.transactionUpdate);

exports.app = functions.https.onRequest(app);


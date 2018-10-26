const firebase = require("firebase-admin");

exports.validateFirebaseIdToken = (req, res, next) => {

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
const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

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

exports.sendInvite = (email, owner, projectName) => {

  console.log("Sending Mail to :" + email);
  const mailOptions = {
    from: `${APP_NAME} <noreply@inandout.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `${APP_NAME} Project share request from ${owner} !`;
  mailOptions.html = generateInviteText(email, owner, projectName);

  return mailTransport.sendMail(mailOptions);
};

const generateInviteText = (email, owner, projectName) => {

  return `
      <div> Hello ! </div> 
      <div> You have been invited to share a project "${projectName}" with ${owner}</div>
      <div> Please follow this link: <a href=${signUpURL}> In&Out</a> In order to sign up and start working on your projects!</div>`;
};
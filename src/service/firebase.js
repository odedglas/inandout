import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import {config} from '../config/firebase';

if (!firebase.apps.length) {
  console.log('Initalizing firbase, existing apps: ' + firebase.apps.length);
  firebase.initializeApp(config);
}

const auth = firebase.auth(), database = firebase.database();
export default {
  auth,
  database,
  createUser: (id, displayName, email) => {
    return database.ref(`users/${id}`).set({
      displayName,
      email
    })
  }
}
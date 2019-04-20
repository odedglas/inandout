import firebaseService from './firebase';
import userService from './user';
import {FIREBASE_LOGIN_PROVIDERS, FIRBASE_CUSTOM_LOGIN_PROVIDERS} from '@const/';

const auth = firebaseService.auth;
const authInstance = firebaseService.instance.auth;

export default {

  loginWithPassword: (email, password) => auth.signInWithEmailAndPassword(email, password),

  signUp: (email, password, displayName) => auth.createUserWithEmailAndPassword(email, password).then(authUser => {

    //Returns the user creation
    return userService.createUser(
      authUser.user.uid,
      displayName,
      email
    ).then((user) => {
      return {
        user,
        authUser,
      }
    });
  }),

  loginWithProvider: (providerName, token) => {

    let provider;

    if(FIRBASE_CUSTOM_LOGIN_PROVIDERS.includes(providerName) && token) {
      return auth.signInWithCustomToken(token)
    }

    switch (providerName) {

      case FIREBASE_LOGIN_PROVIDERS.GOOGLE:
        provider = new authInstance.GoogleAuthProvider();
        break;
      case FIREBASE_LOGIN_PROVIDERS.TWITTER:
        provider = new authInstance.TwitterAuthProvider();
        break;
      case FIREBASE_LOGIN_PROVIDERS.FACEBOOK:
        provider = new authInstance.FacebookAuthProvider();
        break;
      default:
    }

    //Provider login
    return auth.signInWithPopup(provider)
  },

  signOut: () => auth.signOut(),

  forgotPassword: (email) => auth.sendPasswordResetEmail(email)
}
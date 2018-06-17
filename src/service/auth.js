import firebaseService from './firebase';
const auth = firebaseService.auth;
const loginWithProvider = provider => auth.signInWithPopup(provider);

export default {
  loginWithPassword: (email, password) => auth.signInWithEmailAndPassword(email, password),
  signUp: (email, password, displayName) => auth.createUserWithEmailAndPassword(email, password).then(authUser => {

    //Returns the user creation
    return firebaseService.createUser(
      authUser.user.uid,
      displayName,
      email
    ).then(() => authUser);
  }),
  loginWithGoogle  : () => loginWithProvider(new auth.GoogleAuthProvider()),
  loginWithFacebook: () => loginWithProvider(new auth.FacebookAuthProvider()),
  loginWithTwitter : () => loginWithProvider(new auth.TwitterAuthProvider_Instance()),
  loginWithGithub  : () => loginWithProvider(new auth.GithubAuthProvider()),
  signOut: () => auth.signOut(),
  forgotPassword: (email) => auth.sendPasswordResetEmail(email)
}
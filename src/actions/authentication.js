import firebaseService from '@service/firebase';
import authService from '@service/auth';

export function createAuthenticationListener(location) {

  return dispatch => {

    dispatch({type: 'AUTHENTICATION_START'});

    firebaseService.auth.onAuthStateChanged(authUser => {

      console.log("Auth state change listener : " +( authUser !== null ? 'true' : 'false'));
      authUser
        ? dispatch({type: 'AUTHENTICATION_SUCCESS', authUser: authUser})
        : dispatch({type: 'AUTHENTICATION_FAIL', from: location});

    });
  }
}


export function loginWithPassword(email, password, onSuccess, onError) {
  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});
    dispatch({type: 'LOGIN_STATE_CHANGE', loggingIn: true});

    authService.loginWithPassword(email, password).then(authUser => {

      //Auth success
      dispatch({type: 'AUTHENTICATION_SUCCESS', authUser: authUser});

      onSuccess();

    }).catch(e => {
      console.log('Failed to login : ' + e);
      onError(e);
    })
      .finally(() => {
        dispatch({type: 'LOGIN_STATE_CHANGE', loggingIn: false});
        dispatch({type: 'APP_LOADING', loading: false})
      });
  }
}

export function signUp(email, password, displayName, onSuccess, onError) {
  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});
    dispatch({type: 'LOGIN_STATE_CHANGE', loggingIn: true});

    authService.signUp(email, password, displayName).then(authUser => {

      dispatch({type: 'AUTHENTICATION_SUCCESS', authUser: authUser});

      onSuccess();

    }).catch(onError)
      .finally(() => {
      dispatch({type: 'LOGIN_STATE_CHANGE', loggingIn: false});
      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function logout() {
  return dispatch => {
    authService.signOut().then(() => dispatch({type: 'LOGOUT'}));
  }
}
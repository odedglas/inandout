import firebaseService from '@service/firebase';
import authService from '@service/auth';

export function createAuthenticationListener() {

  return dispatch => {

    dispatch({ type: 'APP_LOADING', loading: true });
    dispatch({ type: 'AUTHENTICATION_START'});

    firebaseService.auth.onAuthStateChanged(authUser => {
      authUser
        ? dispatch({ type: 'AUTHENTICATION_SUCCESS', authUser: authUser })
        : dispatch({ type: 'AUTHENTICATION_FAIL'});

      dispatch({ type: 'APP_LOADING', loading: false });

    });
  }
}

export function loginWithPassword(username, password, onSuccess, onError) {
  return dispatch => {
    dispatch({ type: 'APP_LOADING', loading: true });

    authService.loginWithPassword(username, password).then(authUser => {

      //Auth success
      dispatch({ type: 'AUTHENTICATION_SUCCESS', authUser: authUser});

      onSuccess();

    }).catch(e => { console.log('Failed to login : ' + e); onError(e); })
      .finally( () => dispatch({ type: 'APP_LOADING', loading: false }) );
  }
}

export function logout() {
  return dispatch =>  {
    authService.signOut().then(() => dispatch({ type: 'LOGOUT'}) );
  }
}
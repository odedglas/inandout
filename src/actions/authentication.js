import firebaseService from '@service/firebase';
import authService from '@service/auth';

export function createAuthenticationListener() {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});
    dispatch({type: 'AUTHENTICATION_START'});

    firebaseService.auth.onAuthStateChanged(authUser => {
      authUser
        ? dispatch({type: 'AUTHENTICATION_SUCCESS', authUser: authUser})
        : dispatch({type: 'AUTHENTICATION_FAIL'});

      dispatch({type: 'APP_LOADING', loading: false});

    });
  }
}

export function loginWithPassword(email, password, onSuccess, onError) {
  return dispatch => {
    dispatch({type: 'APP_LOADING', loading: true});

    authService.loginWithPassword(email, password).then(authUser => {

      //Auth success
      dispatch({type: 'AUTHENTICATION_SUCCESS', authUser: authUser});

      onSuccess();

    }).catch(e => {
      console.log('Failed to login : ' + e);
      onError(e);
    })
      .finally(() => dispatch({type: 'APP_LOADING', loading: false}));
  }
}

export function signUp(email, password, displayName, onSuccess, onError) {
  return dispatch => {
    dispatch({type: 'APP_LOADING', loading: true});

    authService.signUp(email, password, displayName).then(authUser => {

      //Creating user
      firebaseService.createUser(
        authUser.user.id,
        displayName,
        email
      ).then((d) => {
        debugger;
        //Auth success
        dispatch({type: 'AUTHENTICATION_SUCCESS', authUser: authUser});

        onSuccess();

      })
        .catch(onError)
        .finally(() => dispatch({type: 'APP_LOADING', loading: false}));

    }).catch(onError)
      .finally(() => dispatch({type: 'APP_LOADING', loading: false}));
  }
}

export function logout() {
  return dispatch => {
    authService.signOut().then(() => dispatch({type: 'LOGOUT'}));
  }
}
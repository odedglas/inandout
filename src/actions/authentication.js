import firebaseService from '@service/firebase';
import authService from '@service/auth';
import userService from '@service/user';

export function createAuthenticationListener(location) {

  return dispatch => {

    dispatch({type: 'AUTHENTICATION_START'});

    firebaseService.auth.onAuthStateChanged(authUser => {

      console.log("Auth state change listener : " +( authUser !== null ? 'true' : 'false'));
      if(authUser !== null) {

        //Auth went well, Fetching up user
        userService.fetchUser(authUser.uid).then( user => {

          dispatch({type: 'AUTHENTICATION_SUCCESS', authUser: authUser});
          dispatch({type: 'SET_USER', user: user});
        });
      }
      else {

        dispatch({type: 'AUTHENTICATION_FAIL', from: location});
      }
    });
  }
}


export function loginWithPassword(email, password, onSuccess, onError) {
  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});
    dispatch({type: 'LOGIN_STATE_CHANGE', loggingIn: true});

    authService.loginWithPassword(email, password).then(authUser => {

      userService.fetchUser(authUser.user.uid).then( user => {

        //Auth success
        dispatch({type: 'SET_USER', user: user});
        dispatch({type: 'AUTHENTICATION_SUCCESS', authUser: authUser});

        onSuccess();
      });
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

    authService.signUp(email, password, displayName).then(res => {

      //Auth success
      dispatch({type: 'SET_USER', user: res.user});
      dispatch({type: 'AUTHENTICATION_SUCCESS', authUser: res.authUser});

      onSuccess();

    }).catch(onError)
      .finally(() => {
      dispatch({type: 'LOGIN_STATE_CHANGE', loggingIn: false});
      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function signOut() {
  return dispatch => {
    authService.signOut().then(() => dispatch({type: 'LOGOUT'}));
  }
}
import firebaseService from '@service/firebase';
import authService from '@service/auth';
import userService from '@service/user';


const fetchUserSuccess = (dispatch, { authUser, user, projectsKeys}) => {
  dispatch({type: 'SET_USER', user});
  dispatch({type: 'SET_PROJECTS_KEYS', projectsKeys});
  dispatch({type: 'AUTHENTICATION_SUCCESS', authUser});
};

export function createAuthenticationListener(location) {

  return dispatch => {

    dispatch({type: 'AUTHENTICATION_START'});

    firebaseService.auth.onAuthStateChanged(authUser => {

      console.log("Auth state change listener : " +( authUser !== null ? 'true' : 'false'));
      if(authUser !== null) {

        //Auth went well, Fetching up user
        userService.fetchUser(authUser.uid).then( res => {

          fetchUserSuccess(
            dispatch,
            {authUser, user:res.user, projectsKeys: res.projectsKeys}
          );
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

    authService.loginWithPassword(email, password).then(authUser => {

      userService.fetchUser(authUser.user.uid).then( res => {

        fetchUserSuccess(
          dispatch,
          {authUser, user:res.user, projectsKeys: res.projectsKeys}
        );

        onSuccess();
      }).finally(() => {
          dispatch({type: 'APP_LOADING', loading: false})
        });
    }).catch(e => {
      console.log('Failed to login : ' + e);
      onError(e);
      dispatch({type: 'APP_LOADING', loading: false})
    })
  }
}

export function signUp(email, password, displayName, onSuccess, onError) {
  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    authService.signUp(email, password, displayName).then(res => {

      //Auth success
      dispatch({type: 'SET_USER', user: res.user});
      dispatch({type: 'AUTHENTICATION_SUCCESS', authUser: res.authUser});

      onSuccess();

    }).catch(onError)
      .finally(() => {
      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function signOut() {
  return dispatch => {
    authService.signOut().then(() => dispatch({type: 'LOGOUT'}));
  }
}
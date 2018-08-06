import firebaseService from '@service/firebase';
import authService from '@service/auth';
import userService from '@service/user';


const fetchUserSuccess = (dispatch, { authUser, user}) => {
  dispatch({type: 'SET_USER', user});
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

          res && fetchUserSuccess(
            dispatch,
            {authUser, user:res.user}
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
          {authUser, user:res.user}
        );

        onSuccess();
        dispatch({type: 'APP_LOADING', loading: false})
      })
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
      dispatch({type: 'APP_LOADING', loading: false})
    }).catch(onError);
  }
}

export function loginWithProvider(providerName) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    authService.loginWithProvider(providerName).then(res => {

      const authUser = res.user;
      //Trying to fetch existing user
      userService.fetchUser(authUser.uid).then(user => {

        if(!user) {

          //First login via provider, Creating app user
          return userService.createUser(
            authUser.uid,
            authUser.displayName,
            authUser.email,
            authUser.photoURL
          ).then(createdUser => {

            fetchUserSuccess(
              dispatch,
              {authUser, user:createdUser}
            );

            dispatch({type: 'APP_LOADING', loading: false})
          })
        }

        //Existing user
        fetchUserSuccess(
          dispatch,
          {authUser, user:user}
        );
        dispatch({type: 'APP_LOADING', loading: false})
      })

    })
  }
}

export function signOut() {
  return dispatch => {
    authService.signOut().then(() => dispatch({type: 'LOGOUT'}));
  }
}
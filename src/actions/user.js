import userService from '@server/user';

export function fetchUser(id) {

  return dispatch => {

    userService.fetchUser(id).then(user => {
      dispatch({ type: 'SET_USER', user });
    });
  }
}

const initialState = {
  authenticated: false,
  authenticating: true,
  loggingIn: false,
  authUser  : {},
};

export default function (state = initialState, action) {
  switch (action.type) {

    case 'AUTHENTICATION_START' :
      return {
        ...state,
        authenticated: false,
        authenticating: true,
      };
    case 'AUTHENTICATION_SUCCESS':
      return {
        ...state,
        authenticated: true,
        authenticating: false,
        authUser  : action.authUser,
      };
    case 'AUTHENTICATION_FAIL':
      return {
        ...state,
        authenticated: false,
        authenticating: false,
        authUser  : {},
      };
    case 'LOGIN_STATE_CHANGE':
      return {
        ...state,
        loggingIn: action.loggingIn
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        authUser  : {},
      };
    default:
      return state;
  }
}
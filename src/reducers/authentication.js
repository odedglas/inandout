const initialState = {
  authenticated: false,
  authenticating: true,
  currentUser  : {},
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
      console.log("Authentication success for : ");
      return {
        ...state,
        authenticated: true,
        authenticating: false,
        currentUser  : action.authUser,
      };
    case 'AUTHENTICATION_FAIL':
      return {
        ...state,
        authenticated: false,
        authenticating: false,
        currentUser  : {},
      };
    case 'SIGN_UP_SUCCESS' :
      return {
        ...state,
        authenticated: true,
        authenticating: false,
        currentUser  : action.authUser,
      };
    case 'LOGOUT':
      return {
        ...state,
        authenticated: false,
        currentUser  : {},
      };
    default:
      return state;
  }
}
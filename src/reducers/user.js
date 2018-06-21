const initialState = {
  currentUser: {
    displayName: undefined,
    email: undefined,
    initials: undefined,
    avatarImage: undefined,
    avatarColor: undefined
  }
};

export default function (state = initialState, action) {
  switch (action.type) {

    case 'SET_USER' :
      return {
        ...state,
        currentUser: action.user,
      };

    default:
      return state;
  }
}
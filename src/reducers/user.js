import firebaseServcie from '@service/firebase'

const initialState = {
  currentUser: {
    id: undefined,
    displayName: undefined,
    email: undefined,
    initials: undefined,
    avatarImage: undefined,
    avatarColor: undefined,
    projects:[]
  }
};

export default function (state = initialState, action) {
  switch (action.type) {

    case 'SET_USER' :
      firebaseServcie.initUser(action.user);
      return {
        ...state,
        currentUser: action.user,
      };

    default:
      return state;
  }
}
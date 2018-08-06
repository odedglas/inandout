
const initialState = {
  id: undefined,
  displayName: undefined,
  email: undefined,
  initials: undefined,
  avatarImage: undefined,
  avatarColor: undefined,
  projects:[]
};

export default function (state = initialState, action) {
  switch (action.type) {

    case 'SET_USER' :
      return {
        ...state,
        ...action.user,
      };

    default:
      return state;
  }
}
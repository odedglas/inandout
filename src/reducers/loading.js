const initialState = {
  isLoading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'APP_LOADING':
      return {
        ...state,
        isLoading: action.loading,
      };
    default:
      return state;
  }
}
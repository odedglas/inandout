const initialState = {
  isLoading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'APP_LOADING':
      console.log("setting app loading for : " + action.loading);
      return {
        ...state,
        isLoading: action.loading,
      };
    default:
      return state;
  }
}
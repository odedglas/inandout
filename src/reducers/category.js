const initialState = {
  defaultCategories: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_DEFAULTS':
      return {
        ...state,
        defaultCategories: action.categories,
      };

    default:
      return state;
  }
}
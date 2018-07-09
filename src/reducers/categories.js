const initialState = {
  defaults: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_DEFAULTS_CATEGORIES':
      return {
        ...state,
        defaults: action.defaultCategories
      };

    default:
      return state;
  }
}

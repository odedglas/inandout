const initialState = {
  defaultCategories: [],
  customCategories: [],
  categories: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_DEFAULTS_CATEGORIES':
      return {
        ...state,
        defaultCategories: action.categories,
        categories: [...state.customCategories, ...action.categories]
      };
    case 'SET_CUSTOM_CATEGORIES':
      return {
        ...state,
        customCategories: action.categories,
        categories: [...action.categories, ...state.defaultCategories]
      };

    default:
      return state;
  }
}
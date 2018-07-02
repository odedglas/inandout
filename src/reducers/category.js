const initialState = {
  defaultCategories: [],
  customCategories: [],
  excluded: [],
  categories: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_DEFAULTS_CATEGORIES':
      return {
        ...state,
        defaultCategories: action.categories,
        categories: [...state.customCategories, ...filterExcluded(action.categories, state.excluded)]
      };
    case 'SET_CUSTOM_CATEGORIES':

      return {
        ...state,
        customCategories: action.categories,
        categories: [...action.categories, ...filterExcluded(state.defaultCategories, action.excluded)],
        excluded: action.excluded
      };

    case 'EXCLUDE_DEFAULT_CATEGORY':

      const excluded = state.excluded;
      excluded.push(action.categoryId);

      return {
        ...state,
        customCategories: state.customCategories,
        categories: [...state.customCategories, ...filterExcluded(state.defaultCategories, excluded)],
        excluded: excluded
      };

    default:
      return state;
  }
}

const filterExcluded = (categories, excluded) =>  {
  excluded = Array.isArray(excluded) ? excluded : [excluded];
  return categories.filter(c => excluded.indexOf(c.id) === -1);
};
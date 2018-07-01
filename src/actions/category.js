import categoryService from '@service/category'
const categoriesLoadKey = 'defaultCategories';

export function fetchDefaults() {
  return dispatch => {

    dispatch({type: 'ADD_DASHBOARD_LOADING', loadKey: categoriesLoadKey});

    categoryService.fetchDefaults().then((categories) => {

      dispatch({type: 'SET_DEFAULTS', categories});
    })
      .finally(() => dispatch({type: 'REMOVE_DASHBOARD_LOADING', loadKey: categoriesLoadKey}));
  }
}
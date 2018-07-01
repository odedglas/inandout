import categoryService from '@service/category'
const categoriesLoadKey = 'defaultCategories';

export function fetchDefaults() {
  return dispatch => {

    dispatch({type: 'ADD_DASHBOARD_LOADING', loadKey: categoriesLoadKey});

    categoryService.fetchDefaults().then((categories) => {

      dispatch({type: 'SET_DEFAULTS_CATEGORIES', categories});
    })
      .finally(() => dispatch({type: 'REMOVE_DASHBOARD_LOADING', loadKey: categoriesLoadKey}));
  }
}

export function createCategory(projectId, { name, icon, color }) {

  return dispatch => {
      debugger;
    categoryService.createCategory(projectId, name, icon, color).then(d => {

    })
  }
}
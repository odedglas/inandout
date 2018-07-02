import {selectProject} from './project'

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

export function createCategory(project, { name, icon, color }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    categoryService.createCategory(project.id, name, icon, color).then(category => {

      let currentCategories = project.categories || [];
      currentCategories = currentCategories.concat(category);
      project.categories = currentCategories;

      dispatch({ type: 'SET_CUSTOM_CATEGORIES', categories: currentCategories });
      dispatch({ type: 'SET_SELECTED_PROJECT', project });

      onSuccess();
    }).finally(() =>  dispatch({type: 'APP_LOADING', loading: false}))
  }
}

export function editCategory(project, {id, name, icon, color }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    categoryService.editCategory(project.id, id, name, icon, color).then(category => {

      let editedCategoryIndex = project.categories.findIndex(c => c.id === id);
      project.categories[editedCategoryIndex] = category;

      dispatch(selectProject(project));

      onSuccess();
    }).finally(() =>  dispatch({type: 'APP_LOADING', loading: false}))
  }
}

export function removeCategory(project, categoryId) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    categoryService.removeCategory(project.id, categoryId).then(() => {

      project.categories = project.categories.filter(c => c.id !== categoryId);

      dispatch(selectProject(project));

    }).finally(() =>  dispatch({type: 'APP_LOADING', loading: false}))
  }
}

export function excludeDefaultCategory(project, categoryId) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    categoryService.excludeCategory(project.id, categoryId).then(() => {

      dispatch({type: 'EXCLUDE_DEFAULT_CATEGORY', categoryId});

    }).finally(() =>  dispatch({type: 'APP_LOADING', loading: false}))
  }
}
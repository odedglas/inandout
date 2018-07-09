import localStorageService from '@service/localstorage'
import {LOCAL_STORAGE} from '@const/'
import categoryService from '@service/category'

export function setPreSelectedProject(identifier) {
  return dispatch => dispatch({type: 'SET_PRE_SELECTED_PROJECT', identifier});
}

export function selectProject(project) {

  return dispatch =>  {

    dispatch({
      type: 'SET_SELECTED_PROJECT',
      project: {
        id: project.id,
        identifier: project.identifier,
        owner: project.owner,
        type: project.type,
        name: project.name,
        currency: project.currency,
        description: project.description,
      },
      customers: project.customers,
      budgets: project.budgets,
      categories: project.categories,
      transactions: project.transactions,
      members: project.members,
    });
  }
}

export function createCategory(project, { name, icon, color }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    categoryService.createCategory(project.id, name, icon, color).then(category => {
      onSuccess();

      dispatch({type: 'ADD_PROJECT_CATEGORY', category});
      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function editCategory(project, {id, name, icon, color }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    categoryService.editCategory(project.id, id, name, icon, color).then(category => {

      onSuccess();

      dispatch({type: 'EDIT_PROJECT_CATEGORY', category});
      dispatch({type: 'APP_LOADING', loading: false})
    })
  }
}

export function removeCategory(project, categoryId, exclude) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    categoryService[exclude ? 'excludeCategory' : 'removeCategory'](project.id, categoryId).then(() => {

      dispatch({type: 'REMOVE_PROJECT_CATEGORY', categoryId});
      dispatch({type: 'APP_LOADING', loading: false});
    })
  }
}

export function toggleProjectDrawer(open) {
  return dispatch => {
    //Saving to local storage
    localStorageService.set(LOCAL_STORAGE.PROJECT_DRAWER_OPEN, open);
    dispatch({ type: 'TOGGLE_PROJECT_DRAWER', open });
  }
}

export function updateCachedProject() {

  return (dispatch, getState) => {

    //Extracting project
    const projectState = getState().project;

    const project = {
      ...projectState.selectedProject,
      customers: projectState.customers,
      budgets: projectState.budgets,
      categories: projectState.categories,
      transactions: projectState.transactions,
      members: projectState.members,
    };

    dispatch({ type: 'UPDATE_PROJECT', project });
  }
}

const filterExcluded = (categories, excluded) =>  {
  excluded = Array.isArray(excluded) ? excluded : (excluded ? [excluded] : []);
  return categories.filter(c => excluded.indexOf(c.id) === -1);
};
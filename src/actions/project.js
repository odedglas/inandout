import localStorageService from '@service/localstorage'
import {LOCAL_STORAGE} from '@const/'
import categoryService from '@service/category'
import budgetService from '@service/budget'

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

export function createBudget(project, { name, limit, period, categories }, onSuccess) {

  return (dispatch, getState) => {

    dispatch({type: 'APP_LOADING', loading: true});

    budgetService.createBudget(project.id, name, limit, period, categories).then(budget => {

      let projectState = getState().project;
      budget = budgetService.fillBudget(
        budget,
        projectState.categories,
        projectState.transactions
      );

      onSuccess();

      dispatch({type: 'ADD_PROJECT_BUDGET', budget});
      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function editBudget(project, {id, name, limit, period, categories }, onSuccess) {

  return (dispatch, getState) => {

    dispatch({type: 'APP_LOADING', loading: true});

    budgetService.editBudget(project.id, id, name, limit, period, categories).then(budget => {

      let projectState = getState().project;
      budget = budgetService.fillBudget(
        budget,
        projectState.categories,
        projectState.transactions
      );

      onSuccess();

      dispatch({type: 'EDIT_PROJECT_BUDGET', budget});
      dispatch({type: 'APP_LOADING', loading: false})
    })
  }
}

export function deleteBudget(project, budgetId) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    budgetService.deleteBudget(project.id, budgetId).then(() => {

      dispatch({type: 'DELETE_PROJECT_BUDGET', budgetId});
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

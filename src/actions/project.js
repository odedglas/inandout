import localStorageService from '@service/localstorage'
import {LOCAL_STORAGE} from '@const/'
import categoryService from '@service/category'
import budgetService from '@service/budget'
import transactionService from '@service/transaction'

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
      excludedCategories: project.excludedCategories,
      transactions: project.transactions,
      members: project.members,
    });
  }
}

export function createCategory(project, { name, icon, color }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    categoryService.createCategory(project.id, name, icon, color).then(category => {

      dispatch({type: 'ADD_PROJECT_CATEGORY', category});
      onSuccess(category);

      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function editCategory(project, {id, name, icon, color }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    categoryService.editCategory(project.id, id, name, icon, color).then(category => {

      dispatch({type: 'EDIT_PROJECT_CATEGORY', category});

      onSuccess(category);

      dispatch({type: 'APP_LOADING', loading: false})
    })
  }
}

export function excludeCategory(project, category) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    categoryService.excludeCategory(project.id, category.id).then(() => {

      dispatch({type: 'EXCLUDE_PROJECT_CATEGORY', category});
      dispatch({type: 'APP_LOADING', loading: false});
    })
  }
}

export function includeCategory(project, category) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    categoryService.includeCategory(project.id, category.id).then(() => {

      dispatch({type: 'INCLUDE_CATEGORY_PROJECT_CATEGORY', category});
      dispatch({type: 'APP_LOADING', loading: false});
    })
  }
}

export function createBudget(project, { name, limit, period, categories }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    budgetService.createBudget(project.id, name, limit, period, categories).then(budget => {

      dispatch({type: 'ADD_PROJECT_BUDGET', budget});

      onSuccess(budget);

      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function editBudget(project, {id, name, limit, period, categories }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    budgetService.editBudget(project.id, id, name, limit, period, categories).then(budget => {

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

export function createTransaction(transaction) {

  return dispatch => dispatch({type: 'ADD_PROJECT_TRANSACTION', transaction});
}

export function updateTransaction(transaction) {

  return dispatch => dispatch({type: 'EDIT_PROJECT_TRANSACTION', transaction});
}

export function deleteTransaction(transaction) {

  return dispatch => dispatch({type: 'DELETE_PROJECT_TRANSACTION', id:transaction.id});
}

export function toggleProjectDrawer(open) {
  return dispatch => {
    //Saving to local storage
    localStorageService.set(LOCAL_STORAGE.PROJECT_DRAWER_OPEN, open);
    dispatch({ type: 'TOGGLE_PROJECT_DRAWER', open });
  }
}

export function loadTransactions(date, onSuccess) {

 return (dispatch, getState) => {

   const monthKey = transactionService.transactionsDateKey(date);

   let projectState = getState().project;
   let users = getState().dashboard.users;
   const projectKey = projectState.selectedProject.id;

   transactionService.fetchTransactions(projectKey, monthKey).then(transactions => {

     const merged = transactionService.mergeTransactions(transactions, projectState.customers, projectState.categories, users);
     onSuccess(merged);
   });
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

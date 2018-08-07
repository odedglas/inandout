import firebaseService from '@service/firebase'
import localStorageService from '@service/localstorage'
import {LOCAL_STORAGE} from '@const/'
import projectService from '@service/project'
import categoryService from '@service/category'
import budgetService from '@service/budget'
import transactionService from '@service/transaction'
import customerService from '@service/customer'
import calendarService from '@service/calendar'

import util from '@util/';

const projectSyncListener = {};

export function setPreSelectedProject(identifier) {
  return (dispatch, getState) => {

    const isDashboardInitialized = getState().dashboard.initialized

    //Waiting for dashboard to be initialized
    if(!isDashboardInitialized) {

      dispatch({type: 'SET_PRE_SELECTED_PROJECT', identifier})
    }
    else {

      //Selecting existing project
      const project = getState().projects.find(p => p.identifier === identifier);
      dispatch(selectProject(project));
    }
  };
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
      events: project.events,
      excludedCategories: project.excludedCategories,
      transactions: project.transactions,
      members: project.members,
    });
  }
}

export function createProjectSyncListener (projectId, date) {

  return dispatch => {

    const keys = Object.keys(projectSyncListener);

    //Removing existing listener if exists
    if(!util.isEmptyObject(projectSyncListener)) {

      keys.forEach(k => projectSyncListener[k].ref.off('value', projectSyncListener[k].listener))
    }

    //Creating new project sync listener
    //Transactions sync
    projectSyncListener.transactions = transactionService.createTransactionSyncListener(
      projectId,
      date,
      (transactions) => dispatch({ type: 'SYNC_TRANSACTIONS', transactions })
    );

    //Attaching
    const newKeys = Object.keys(projectSyncListener);
    newKeys.forEach(k => {

      const projectListener = projectSyncListener[k];
      projectListener.listener = projectListener.ref.on('value', (snap) => projectListener.callback(snap))
    })
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

export function createTransaction(project, { type, owner, description, category, customer, date, amount, payments, sourceEventId }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    transactionService.createTransaction(
      project.id,
      type,
      owner,
      description,
      category,
      customer,
      date,
      amount,
      payments,
      sourceEventId
    ).then(transaction => {

      onSuccess(transaction);
      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function updateTransaction(project, { id, type, owner, description, category, customer, date, amount, payments, paymentIndex }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    transactionService.updateTransaction(
      project.id,
      id,
      type,
      owner,
      description,
      category,
      customer,
      date,
      amount,
      payments,
      paymentIndex
    ).then(transaction => {

      onSuccess(transaction);
      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function createCustomer(project, { name, contactName, phone, email, address, logo }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    customerService.createCustomer(
      project.id,
      name,
      contactName,
      phone,
      email,
      address,
      logo
    ).then(customer => {

      dispatch({type: 'ADD_PROJECT_CUSTOMER', customer});
      onSuccess(customer);

      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function editCustomer(project, { id, name, contactName, phone, email, address, logo }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    customerService.editCustomer(
      project.id,
      id,
      name,
      contactName,
      phone,
      email,
      address,
      logo
    ).then(customer => {

      dispatch({type: 'EDIT_PROJECT_CUSTOMER', customer});
      onSuccess(customer);

      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function setStarred(project, { id, star}) {

  return dispatch => {

    customerService.setStarred(project.id, id, star).then(customer => {

      dispatch({type: 'EDIT_PROJECT_CUSTOMER', customer});
    });
  }
}

export function deleteCustomer(project, customerId) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    customerService.removeCustomer(project.id, customerId).then(() => {

      dispatch({type: 'DELETE_PROJECT_CUSTOMER', customerId});
      dispatch({type: 'APP_LOADING', loading: false});
    })
  }
}

export function createEvent(project, { title, type, description, date, color, customer, location }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    calendarService.createEvent(
      project.id,
      title,
      type,
      description,
      date,
      color,
      customer,
      location,
    ).then(event => {

      dispatch({type: 'ADD_PROJECT_EVENT', event});
      onSuccess(event);

      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function editEvent(project, { id, title, description, date , color, customer, location, transaction }, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    calendarService.editEvent(
      project.id,
      id,
      title,
      description,
      date,
      color,
      customer,
      location,
      transaction
    ).then(event => {

      dispatch({type: 'EDIT_PROJECT_EVENT', event});
      onSuccess(event);

      dispatch({type: 'APP_LOADING', loading: false})
    });
  }
}

export function markEventComplete(project, eventId, completed) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    calendarService.completeEvent(project.id, eventId, completed).then(event => {

      dispatch({type: 'EDIT_PROJECT_EVENT', event});
      dispatch({type: 'APP_LOADING', loading: false});
    })
  }
}

export function attachEventTransaction(project, eventId, transaction, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    calendarService.attachEventTransaction(project.id, eventId, transaction).then(event => {

      dispatch({type: 'EDIT_PROJECT_EVENT', event});
      dispatch({type: 'APP_LOADING', loading: false});
      onSuccess();
    })
  }
}

export function deleteEvent(project, eventId) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    calendarService.removeEvent(project.id, eventId).then(() => {

      dispatch({type: 'DELETE_PROJECT_EVENT', eventId});
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

export function fetchEventTransaction(event, onSuccess) {

  return (dispatch, getState) => {

    dispatch({type: 'APP_LOADING', loading: true});

    let projectState = getState().project;
    const projectKey = projectState.selectedProject.id;

    const transactionPath = calendarService.getEventTransactionPath(projectKey, event);
    let users = getState().dashboard.users;

    firebaseService.fetch(transactionPath).then(transaction => {

      const merged = transactionService.mergeTransactions([transaction], projectState.customers, projectState.categories, users)[0];
      onSuccess(merged);
      dispatch({type: 'APP_LOADING', loading: false});
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
      events: projectState.events,
      excludedCategories: projectState.excludedCategories,
      transactions: projectState.transactions,
      members: projectState.members,
    };

    dispatch({ type: 'UPDATE_PROJECT', project });
  }
}

export function inviteProjectMember(project, user, inviteEmail) {

  return (dispatch, getState) => {

    dispatch({type: 'APP_LOADING', loading: true});

    const currentUser = getState().user;

    projectService.sendMemberInvite(project, currentUser, user, inviteEmail).then(() => {

      dispatch({type: 'APP_LOADING', loading: false});
    })
  }
}
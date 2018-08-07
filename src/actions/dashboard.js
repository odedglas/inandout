import projectService from '@service/project'
import transactionService from '@service/transaction'
import categoryService from '@service/category'
import userService from '@service/user'
import notificationService from '@service/notification';

import {selectProject} from "./project";

import util from '@util/';

export function init() {
  return (dispatch, getState) => {

    dispatch({type: 'SET_DASHBOARD_LOADING', loading: true});

    const currentUser = getState().user;
    const projectKeys = currentUser.projects;
    const preSelectedIdentifier = getState().project.preSelectedProject;
    let resolved = {};

    //User projects
    resolved.projects = projectService.fetchUserProjects(projectKeys);

    //Should fetch transactions
    resolved.transactions = transactionService.fetchMonthlyTransactions(projectKeys);

    //App users
    resolved.users = userService.fetchUsers();

    //Default categories
    resolved.defaultCategories = categoryService.fetchDefaults();

    //Notifications
    resolved.notifications = notificationService.fetchUserNotifications(currentUser);

    util.promiseAllObjectProperties(resolved).then(res => {

      const {projects, transactions, defaultCategories, users, notifications} = res;

      const mergedProjectsResult = projectService.mergeProjectResults(projects, transactions, defaultCategories);

      dispatch({type: 'SET_PROJECTS', projects: mergedProjectsResult});
      dispatch({type: 'SET_USERS', users: users});
      dispatch({type: 'SET_NOTIFICATIONS', notifications});
      dispatch({type: 'SET_DEFAULTS_CATEGORIES', defaultCategories});

      const selectedProject = preSelectedIdentifier ? mergedProjectsResult.find(p => p.identifier === preSelectedIdentifier) : null;
      if (selectedProject) {

        dispatch(selectProject(selectedProject));
      }

      dispatch({type: 'SET_DASHBOARD_INITIALIZED'});
      dispatch({type: 'SET_DASHBOARD_LOADING', loading: false});

    });
  }
}

export function showConfirmation(payload) {
  return dispatch => dispatch({type: 'SHOW_CONFIRMATION', payload});
}

export function hideConfirmation() {
  return dispatch => dispatch({type: 'HIDE_CONFIRMATION'});
}


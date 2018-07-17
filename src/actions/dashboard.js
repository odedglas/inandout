import projectService from '@service/project'
import transactionService from '@service/transaction'
import categoryService from '@service/category'
import userService from '@service/user'

import {selectProject} from "./project";

import util from '@util/';

export function init() {
  return (dispatch, getState) => {

    dispatch({type: 'SET_DASHBOARD_LOADING', loading: true});

    const projectKeys = getState().user.projects;
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

    util.promiseAllObjectProperties(resolved).then(res => {

      const {projects, transactions, defaultCategories, users} = res;
      const mergedProjectsResult = projectService.mergeProjectResults(projects, transactions, defaultCategories, users);

      dispatch({type: 'SET_PROJECTS', projects: mergedProjectsResult});
      dispatch({type: 'SET_MONTHLY_TRANSACTIONS', transactions});
      dispatch({type: 'SET_DEFAULTS_CATEGORIES', defaultCategories});

      const selectedProject = preSelectedIdentifier ? mergedProjectsResult.find(p => p.identifier === preSelectedIdentifier) : null;
      if (selectedProject) {

        dispatch(selectProject(selectedProject));
      }

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


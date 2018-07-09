import projectService from '@service/project'
import categoryService from '@service/category'

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

    //Default categories
    resolved.defaultCategories = categoryService.fetchDefaults();

    util.promiseAllObjectProperties(resolved).then(res => {

      const { projects, defaultCategories } = res;
      dispatch({type: 'SET_PROJECTS', projects});
      dispatch({type: 'SET_DEFAULTS_CATEGORIES', defaultCategories});

      const selectedProject = preSelectedIdentifier ? projects.find(p => p.identifier === preSelectedIdentifier) : null;
      if(selectedProject) {

        dispatch(selectProject(selectedProject));
      }

      dispatch({type: 'SET_DASHBOARD_LOADING', loading: false});
    });
  }
}

export function showConfirmation(payload) {
  return dispatch => dispatch({type:'SHOW_CONFIRMATION', payload});
}

export function hideConfirmation() {
  return dispatch => dispatch({type:'HIDE_CONFIRMATION'});
}
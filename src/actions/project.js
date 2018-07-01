import projectService from '@service/project'
import categoryService from '@service/category'
import localStorageService from '@service/localstorage'
import {LOCAL_STORAGE} from '@const/'

const projectsLoadKey = 'userProjects';

export function fetchProject(identifier) {
  return dispatch => {

    const projectTemplate = {identifier};

    dispatch({type: 'SET_SELECTED_PROJECT', project: projectTemplate});
    dispatch({type: 'LOAD_PROJECT', loading: true});

    projectService.fetchProject(identifier).then(project => {

      dispatch({type: 'SET_SELECTED_PROJECT', project});

      //Fetching categories
      categoryService.fetchDefaults().then((categories) => {

        dispatch({type: 'SET_DEFAULTS', categories});
        dispatch({type: 'LOAD_PROJECT', loading: false})
      });
    });
  }
}

export function setPreSelectedProject(identifier) {
  return dispatch => dispatch({type: 'SET_PRE_SELECTED_PROJECT', identifier});
}

export function fetchUserProjects() {
  return (dispatch, getState) => {

    dispatch({type: 'ADD_DASHBOARD_LOADING', loadKey: projectsLoadKey});
    const projectKeys = getState().project.keys;

    projectService.fetchUserProjects(
      projectKeys
    ).then(projects => {

      dispatch({type: 'SET_PROJECTS', projects});
    })
      .finally(() =>  dispatch({type: 'REMOVE_DASHBOARD_LOADING', loadKey: projectsLoadKey}));
  }
}

export function createProject({projectName, projectType, projectDescription}, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    projectService.createProject(
      projectName,
      projectType,
      projectDescription,
    ).then((project) => {

      dispatch({type: 'ADD_PROJECT', project});
      dispatch({ type: 'SET_SELECTED_PROJECT', project });
      onSuccess(project);

    })
      .finally(() => dispatch({type: 'APP_LOADING', loading: false}));

  }
}

export function selectProject(project) {

  return dispatch =>  dispatch({ type: 'SET_SELECTED_PROJECT', project });
}

export function toggleProjectDrawer(open) {
  return dispatch => {
    //Saving to local storage
    localStorageService.set(LOCAL_STORAGE.PROJECT_DRAWER_OPEN, open);
    dispatch({ type: 'TOGGLE_PROJECT_DRAWER', open });
  }
}
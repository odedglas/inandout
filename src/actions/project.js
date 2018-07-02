import projectService from '@service/project'
import localStorageService from '@service/localstorage'
import {LOCAL_STORAGE} from '@const/'

const projectsLoadKey = 'userProjects';

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

      const preSelectedIdentifier = getState().project.preSelectedProject;
      const selectedProject = preSelectedIdentifier ? projects.find(p => p.identifier === preSelectedIdentifier) : null;

      if(selectedProject) {
        dispatch(selectProject(selectedProject));
      }

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

  return dispatch =>  {

    dispatch({ type: 'SET_SELECTED_PROJECT', project });
    dispatch({ type: 'SET_CUSTOM_CATEGORIES', categories: project.categories, excluded: project.excludedCategories});
  }
}

export function toggleProjectDrawer(open) {
  return dispatch => {
    //Saving to local storage
    localStorageService.set(LOCAL_STORAGE.PROJECT_DRAWER_OPEN, open);
    dispatch({ type: 'TOGGLE_PROJECT_DRAWER', open });
  }
}
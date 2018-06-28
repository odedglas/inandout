import projectService from '@service/project'

export function fetchUserProjects() {
  return (dispatch, getState) => {

    dispatch({type: 'FETCH_PROJECTS', fetching: true});
    const projectKeys = getState().project.keys;

    projectService.fetchUserProjects(
      projectKeys
    ).then(projects => {

      dispatch({type: 'SET_PROJECTS', projects});
    })
      .finally(() => dispatch({type: 'FETCH_PROJECTS', fetching: false}));
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
  return dispatch => dispatch({ type: 'TOGGLE_PROJECT_DRAWER', open });
}
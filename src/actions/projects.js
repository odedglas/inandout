import projectService from '@service/project'
import {selectProject} from "./project";

export function createProject({projectName, projectType, projectDescription, projectCurrency}, onSuccess) {

  return dispatch => {

    dispatch({type: 'APP_LOADING', loading: true});

    projectService.createProject(
      projectName,
      projectType,
      projectDescription,
      projectCurrency
    ).then((project) => {

      onSuccess(project);

      dispatch({type: 'ADD_PROJECT', project});
      dispatch(selectProject(project));
      dispatch({type: 'APP_LOADING', loading: false});
    })
  }
}

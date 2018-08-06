import projectService from '@service/project'
import {selectProject} from "./project";

export function createProject({projectName, projectType, projectDescription, projectCurrency, balance}, onSuccess) {

  return (dispatch, getState) => {

    dispatch({type: 'APP_LOADING', loading: true});

    projectService.createProject(
      projectName,
      projectType,
      projectDescription,
      projectCurrency,
      balance
    ).then((project) => {

      const defaultCategories = getState().categories.defaults;
      const filledProject = projectService.fillProject(project, {}, defaultCategories);

      dispatch({type: 'ADD_PROJECT', project: filledProject});
      dispatch(selectProject(filledProject));
      dispatch({type: 'APP_LOADING', loading: false});

      onSuccess(filledProject);
    })
  }
}

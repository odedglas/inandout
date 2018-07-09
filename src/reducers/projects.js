export default function (state = [], action) {

  switch (action.type) {
    case 'SET_PROJECTS':
      return action.projects;
    case 'ADD_PROJECT':
      return [
        ...state,
        action.project
      ];

    case 'UPDATE_PROJECT':

      const currentProjects = state;
      const project = action.project;
      let editProjectIndex = currentProjects.findIndex(p => p.id === project.id);
      currentProjects[editProjectIndex] = project;

      return [...currentProjects];

    default:
      return state;
  }
}
const initialState = {
  keys: [],
  projects: [],
  fetchingProjects: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_PROJECTS_KEYS':
      return {
        ...state,
        keys: action.projectsKeys
      };
    case 'FETCH_PROJECTS' :
      return {
        ...state,
        fetchingProjects: action.fetching
      };
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.projects
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [
          ...state.projects,
          action.project
        ],
        keys: [
          ...state.keys,
          action.project.id
        ]
      };
    default:
      return state;
  }
}
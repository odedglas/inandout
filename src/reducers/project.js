import localStorageService from '@service/localstorage';

const projectDrawerLocalStorageKey = 'project-drawer-open';

const initialState = {
  keys: [],
  projects: [],
  fetchingProjects: false,
  selectedProject: {},
  drawerOpen: localStorageService.get(projectDrawerLocalStorageKey),
};

console.log("Reduce init project drawer - > " + localStorageService.get(projectDrawerLocalStorageKey));

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
    case 'SET_SELECTED_PROJECT': {
      return {
        ...state,
        selectedProject: action.project
      }
    }
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
    case 'TOGGLE_PROJECT_DRAWER':
      //Saving to local storage
      localStorageService.set(projectDrawerLocalStorageKey, action.open);

      return {
        ...state,
        drawerOpen: action.open
      };
    default:
      return state;
  }
}
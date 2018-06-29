import localStorageService from '@service/localstorage';
import {LOCAL_STORAGE} from '@const/'

const projectDrawerLocalStorageKey = LOCAL_STORAGE.PROJECT_DRAWER_OPEN;

const initialState = {
  keys: [],
  projects: [],
  fetchingProjects: false,
  loadingProject: false,
  selectedProject: {},
  drawerOpen: localStorageService.get(projectDrawerLocalStorageKey),
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
      case 'LOAD_PROJECT' :
      return {
        ...state,
        loadingProject: action.loading
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
      return {
        ...state,
        drawerOpen: action.open
      };
    default:
      return state;
  }
}
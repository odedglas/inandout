import localStorageService from '@service/localstorage';
import {LOCAL_STORAGE} from '@const/'

const projectDrawerLocalStorageKey = LOCAL_STORAGE.PROJECT_DRAWER_OPEN;

const initialState = {
  keys: [],
  projects: [],
  preSelectedProject: undefined,
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
    case 'SET_PRE_SELECTED_PROJECT':
      return {
        ...state,
        preSelectedProject: action.identifier
      };

    case 'SET_SELECTED_PROJECT': {
      return {
        ...state,
        selectedProject: action.project
      }
    }
    case 'SET_PROJECTS':

      const preSelectedIdentifier = state.preSelectedProject;
      const selectedProject = preSelectedIdentifier ? action.projects.find(p => p.identifier === preSelectedIdentifier) : {};

      return {
        ...state,
        projects: action.projects,
        selectedProject: selectedProject,
        preSelectedIdentifier: undefined
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
import localStorageService from '@service/localstorage';
import {LOCAL_STORAGE} from '@const/'

const projectDrawerLocalStorageKey = LOCAL_STORAGE.PROJECT_DRAWER_OPEN;

const initialState = {
  preSelectedProject: undefined,
  selectedProject: {},
  categories:[],
  drawerOpen: localStorageService.get(projectDrawerLocalStorageKey),
};

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SET_PRE_SELECTED_PROJECT':
      return {
        ...state,
        preSelectedProject: action.identifier
      };

    case 'SET_SELECTED_PROJECT': {
      return {
        ...state,
        selectedProject: action.project,
        preSelectedProject: undefined,
        categories: action.categories
      }
    }
    case 'ADD_PROJECT_CATEGORY' : {
      return {
        ...state,
        categories: [action.category, ...state.categories],
      };
    }
    case 'EDIT_PROJECT_CATEGORY' : {

      const currentCategories = state.categories;
      const category = action.category;
      let editedCategoryIndex = currentCategories.findIndex(c => c.id === category.id);
      currentCategories[editedCategoryIndex] = category;

      return {
        ...state,
        categories: currentCategories,
      };
    }
    case 'REMOVE_PROJECT_CATEGORY':

      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.categoryId),
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
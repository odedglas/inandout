import localStorageService from '@service/localstorage';
import {LOCAL_STORAGE} from '@const/'
import util from '@util/';

const projectDrawerLocalStorageKey = LOCAL_STORAGE.PROJECT_DRAWER_OPEN;

const initialState = {
  preSelectedProject: undefined,
  selectedProject: {},
  categories:[],
  budgets: [],
  transactions: [],
  customers: [],
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
        categories: action.categories,
        transactions: action.transactions,
        customers: action.customers || [],
        budgets: action.budgets || [],
      }
    }
    case 'ADD_PROJECT_CATEGORY' : {
      return {
        ...state,
        categories: [action.category, ...state.categories],
      };
    }
    case 'EDIT_PROJECT_CATEGORY' : {

      return {
        ...state,
        categories: util.updateById(state.categories, action.category),
      };
    }
    case 'REMOVE_PROJECT_CATEGORY':

      return {
        ...state,
        categories: state.categories.filter(c => c.id !== action.categoryId),
      };

      case 'ADD_PROJECT_BUDGET' : {
      return {
        ...state,
        budgets: [...state.budgets, action.budget],
      };
    }
    case 'EDIT_PROJECT_BUDGET' : {

      return {
        ...state,
        budgets: util.updateById(state.budgets, action.budget),
      };
    }
    case 'DELETE_PROJECT_BUDGET':

      return {
        ...state,
        budgets: state.budgets.filter(b => b.id !== action.budgetId),
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
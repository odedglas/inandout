import localStorageService from '@service/localstorage';
import {LOCAL_STORAGE} from '@const/'
import util from '@util/';

const projectDrawerLocalStorageKey = LOCAL_STORAGE.PROJECT_DRAWER_OPEN;

const initialState = {
  preSelectedProject: undefined,
  selectedProject: {},
  members:[],
  categories:[],
  excludedCategories:[],
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

      const categories = mapExcludedCategories(action.categories, action.excludedCategories)

      return {
        ...state,
        selectedProject: action.project,
        preSelectedProject: undefined,
        categories: categories,
        transactions: action.transactions,
        excludedCategories: action.excludedCategories,
        customers: action.customers,
        budgets: action.budgets,
        members: action.members,
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
    case 'INCLUDE_CATEGORY_PROJECT_CATEGORY': {

      const newExcluded = state.excludedCategories.filter( c => c !== action.category.id);
      const categories = mapExcludedCategories(util.updateById(state.categories, {
        ...action.category,
        excluded: false
      }), newExcluded);

      return {
        ...state,
        excludedCategories: newExcluded,
        categories: categories
      };
    }

    case 'EXCLUDE_PROJECT_CATEGORY': {

      state.excludedCategories.push(action.category.id)
      const categories = mapExcludedCategories(util.updateById(state.categories, {
        ...action.category,
        excluded: true
      }), state.excludedCategories);

      return {
        ...state,
        categories: categories
      };
    }
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

    case 'SYNC_TRANSACTIONS' : {

      return {
        ...state,
        transactions: action.transactions,
      };
    }
    case 'ADD_PROJECT_CUSTOMER' : {
      return {
        ...state,
        customers: [...state.customers, action.customer],
      };
    }
    case 'EDIT_PROJECT_CUSTOMER' : {
      return {
        ...state,
        customers: util.updateById(state.customers, action.customer),
      };
    }
    case 'DELETE_PROJECT_CUSTOMER' : {
      return {
        ...state,
        customers: state.customers.filter(c => c.id !== action.customerId),
      };
    }
    case 'TOGGLE_PROJECT_DRAWER':
      return {
        ...state,
        drawerOpen: action.open
      };
    default:
      return state;
  }
}


const mapExcludedCategories = (categories, excluded) => {

  return categories.map(c => {

    const shouldExclude = excluded.indexOf(c.id) !== -1;

    return {
      ...c,
      excluded: shouldExclude
    }
  }).sort(util.sortJsonFN([
    {name: 'excluded'}, {name: 'isCustom', reverse: true}, {name: 'name'}
  ]))
};
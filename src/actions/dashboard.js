import projectService from '@service/project'
import transactionService from '@service/transaction'
import categoryService from '@service/category'
import userService from '@service/user'

import {selectProject} from "./project";

import util from '@util/';
import date from '@util/date';

export function init() {
  return (dispatch, getState) => {

    dispatch({type: 'SET_DASHBOARD_LOADING', loading: true});

    const projectKeys = getState().user.projects;
    const preSelectedIdentifier = getState().project.preSelectedProject;
    let resolved = {};

    //User projects
    resolved.projects = projectService.fetchUserProjects(projectKeys);

    //Should fetch transactions
    resolved.transactions = transactionService.fetchMonthlyTransactions(projectKeys);

    resolved.users = userService.fetchUsers();

    //Default categories
    resolved.defaultCategories = categoryService.fetchDefaults();

    util.promiseAllObjectProperties(resolved).then(res => {

      const {projects, transactions, defaultCategories, users} = res;
      const mergedProjectsResult = mergeProjectResults(projects, transactions, defaultCategories, users);

      dispatch({type: 'SET_PROJECTS', projects: mergedProjectsResult});
      dispatch({type: 'SET_MONTHLY_TRANSACTIONS', transactions});
      dispatch({type: 'SET_DEFAULTS_CATEGORIES', defaultCategories});

      const selectedProject = preSelectedIdentifier ? mergedProjectsResult.find(p => p.identifier === preSelectedIdentifier) : null;
      if (selectedProject) {

        dispatch(selectProject(selectedProject));
      }

      dispatch({type: 'SET_DASHBOARD_LOADING', loading: false});
    });
  }
}

export function showConfirmation(payload) {
  return dispatch => dispatch({type: 'SHOW_CONFIRMATION', payload});
}

export function hideConfirmation() {
  return dispatch => dispatch({type: 'HIDE_CONFIRMATION'});
}

const mergeProjectResults = (projects, transactions, defaultCategories, users) => {

  const usersMap = util.toIdsMap(users);

  return projects.map(project => {

    const categories = filterExcluded(
      defaultCategories,
      project.excludedCategories
    );

    const customers = project.customers || [];
    const members = project.members || [];
    const budgets = project.budgets || [];
    const projectTransactions = fillTransactions(transactions[project.id], customers, categories, usersMap);
    const projectCategories = project.categories.reverse().concat(categories);

    return {
      ...project,
      owner: usersMap[project.owner],
      customers,
      members: members.map(m => usersMap[m.id]),
      transactions: projectTransactions,
      budgets: fillBudgets(budgets, categories, projectTransactions),
      categories: projectCategories
    }
  })

};

const fillTransactions = (transactions, customers, categories, usersMap) => {

  const customersMap = util.toIdsMap(customers);
  const categoriesMap = util.toIdsMap(categories);

  transactions = transactions.sort(util.sortJsonFN([
    {name: 'date', reverse: true}
  ]));

  return transactions.map(transaction => {

    return {
      ...transaction,
      date: date.format(transaction.date),
      category: transaction.category ? categoriesMap[transaction.category] : 'UNCATEGORIZED',
      customer: transaction.customer ? customersMap[transaction.customer] : undefined,
      owner: usersMap[transaction.owner]
    }

  });

};

const fillBudgets = (budgets, categories, transactions) => {

  const categoriesMap = util.toIdsMap(categories);

  return budgets.map(budget => {

    const budgetCategories = budget.categories;
    const budgetTransactions = transactions.filter(t => budgetCategories.indexOf(t.category.id) !== -1);

    return {
      ...budget,
      categories: budgetCategories.map(cId => categoriesMap[cId]),
      lastTransactions: budgetTransactions.splice(0, budgetTransactions.length > 4 ? 5 : budgetTransactions.length)
    }
  });
};

const filterExcluded = (categories, excluded) => {
  excluded = Array.isArray(excluded) ? excluded : (excluded ? [excluded] : []);
  return categories.filter(c => excluded.indexOf(c.id) === -1);
};


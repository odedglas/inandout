import firebaseService from './firebase';

import util from '@util/'

export default {

  createBudget: (projectId, budget) => {

    return firebaseService.createBudget(projectId, budget)
  },

  getBudgetStatusIndicator: budget => {

    const actual = budget.actual, limit = budget.limit;
    const budgetUsage = (actual / limit) * 100;

    return `${budgetUsage <= 45 ? 'success' : budgetUsage <= 55 ? 'warning' : 'overage'}-indicator`;
  },

  mergeBudgets: (budgets, categories, transactions) => {

    const categoriesMap = util.toIdsMap(categories);

    return budgets.map(budget => {

      const budgetCategories = budget.categories;
      const budgetTransactions = transactions.filter(t => budgetCategories.indexOf(t.category.id) !== -1);

      return {
        ...budget,
        categories: budgetCategories.map(cId => categoriesMap[cId]),
        transactions: budgetTransactions
      }
    });
  }
}

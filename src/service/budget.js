import firebaseService from './firebase';
import variables from '../assets/style/_variables.scss';
import util from '@util/'

const budgetIndicators = [
  {
    className: 'success-indicator',
    color: variables.successColor,
    condition: (usage) => usage <= 75
  },
  {
    className: 'warning-indicator',
    color: variables.warningColor,
    condition: (usage) => usage > 75 && usage <= 79
  },
  {
    className: 'overage-indicator',
    color: variables.errorColor,
    condition: (usage) => usage > 95
  },
];

export default {

  createBudget(projectId, budget) {

    return firebaseService.createBudget(projectId, budget)
  },

  getUsage(actual, limit) {
    return ((actual / limit) * 100).toFixed(2)
  },

  getBudgetStatusIndicator(budget) {

    const budgetUsage = this.getUsage(budget.actual, budget.limit);

    let indicator = budgetIndicators.filter(bi => bi.condition(budgetUsage))[0];
    return {
      ...indicator,
      usage: `${budgetUsage} %`
    }
  },

  mergeBudgets(budgets, categories, transactions) {

    const categoriesMap = util.toIdsMap(categories);

    return budgets.map(budget => {

      const budgetCategories = budget.categories;
      const budgetTransactions = transactions.filter(t => budgetCategories.indexOf(t.category.id) !== -1);

      return {
        ...budget,
        categories: budgetCategories.map(cId => categoriesMap[cId]),
        transactions: budgetTransactions.sort(util.sortJsonFN([
          {name: 'date'}
        ]))
      }
    });
  }
}

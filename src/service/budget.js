import firebaseService from './firebase';
import variables from '../assets/style/_variables.scss';
import util from '@util/'
import date from '@util/date'

const budgetIndicators = [
  {
    className: 'success-indicator',
    color: variables.successColor,
    condition: (usage) => usage <= 75
  },
  {
    className: 'warning-indicator',
    color: variables.warningColor,
    condition: (usage) => usage > 75 && usage <= 90
  },
  {
    className: 'overage-indicator',
    color: variables.errorColor,
    condition: (usage) => usage > 90
  },
];

export default {

  createBudget(projectId, name, limit, period, categories) {

    const budget = {
      name,
      limit: +limit,
      period,
      categories
    };

    return firebaseService.createBudget(projectId, budget)
  },

  editBudget: (projectId, budgetId, name, limit, period, categories) => {

    const budget = {
      name,
      limit: +limit,
      period,
      categories
    };

    const updatePath = budgetPath(projectId, budgetId);

    return firebaseService.update(updatePath, budget).then(() => {
      budget.id = budgetId;
      return budget;
    });
  },
  deleteBudget: (projectId, budgetId) => {
    const path = budgetPath(projectId, budgetId);
    return firebaseService.remove(path)
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

    return budgets.map(budget => {

      return this.fillBudget(budget, categories, transactions)
    });
  },

  fillBudget (budget, categories, transactions){

    const categoriesMap = util.toIdsMap(categories);
    const budgetCategories = budget.categories;
    const budgetTransactions = transactions.filter(t => budgetCategories.indexOf(t.category.id) !== -1);

    const actual = budgetTransactions.reduce((total, t) => {
      total += t.amount;
      return total;
    },0);

    const test = date.getBudgetRange(budget.period)
    console.log(`Budget time range details : Period ${budget.period} / Start ${new Date(test.startTime)} / End ${new Date(test.endTime)} / Statistics Period ${test.statisticsPeriod}`)

    return {
      ...budget,
      actual,
      categories: budgetCategories.map(cId => categoriesMap[cId]),
      transactions: budgetTransactions.sort(util.sortJsonFN([
        {name: 'date'}
      ]))
    }
  }
}

const budgetPath = (projectId, budgetId) => `/projects/${projectId}/budgets/${budgetId}`;

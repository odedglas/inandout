import firebaseService from './firebase';
import transactionService from './transaction';
import variables from '@scss/_variables.scss';
import util from '@util/'
import date from '@util/date'

const budgetIndicators = [
  {
    className: 'success-indicator',
    color: variables.successColor,
    //Negative value ( E.g actual is lower then expected OR until 10 percent deviation )
    condition: (actualVsExpectedDeviation) => actualVsExpectedDeviation <= 10,
    message: 'Great work! your expenses remain in the expected zone.'
  },
  {
    className: 'warning-indicator',
    color: variables.warningColor,
    condition: (actualVsExpectedDeviation) => actualVsExpectedDeviation > 10 && actualVsExpectedDeviation <= 30,
    message: 'Budget expenses are expected to be lower at this point.'
  },
  {
    className: 'overage-indicator',
    color: variables.errorColor,
    condition: (actualVsExpectedDeviation) => actualVsExpectedDeviation > 30,
    message: 'Budget expenses are higher by 30% than expected, Budget will likely breach it\'s limit'
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

    const budgetTimeSlot = date.dayDiff(budget.startDate, budget.endDate);
    const currentTimeUsage = date.dayDiff(budget.startDate, new Date());

    const expected = (currentTimeUsage/ budgetTimeSlot) * budget.limit;
    const expectedActualUsage = this.getUsage(expected, budget.limit);
    const budgetActualUsage = this.getUsage(budget.actual, budget.limit);

    const actualVsExpectedDeviation = ((budget.actual - expected) * 100 / budget.limit).toFixed(2);

    let indicator = budgetIndicators.find(bi => bi.condition(actualVsExpectedDeviation));
    return {
      ...indicator,
      expected: Math.round(expected),
      expectedUsage: `${expectedActualUsage} %`,
      usage: `${budgetActualUsage} %`,
      deviation: actualVsExpectedDeviation,
    }
  },

  mergeBudgets(budgets, categories, transactions, selectedDate) {

    const categoriesMap = util.toIdsMap(categories);

    return budgets ? budgets.map(budget => {

      return this.fillBudget(budget, categoriesMap, transactions, selectedDate)
    }) : [];
  },

  fillBudget (budget, categoriesMap, transactions, selectedDate){

    //Filtering transactions by budget credentials
    const budgetCategories = budget.categories;

    const budgetCurrentRange = date.getBudgetRange(budget.period, selectedDate);
    const budgetTransactions = transactions.filter(t => {

      const categoryMatch = t.category && budgetCategories.indexOf(t.category.id) !== -1;
      const dateMatch = date.between(budgetCurrentRange, t.date);

      return dateMatch && categoryMatch;
    });
    const acceptedTransactions = transactionService.filterAccepted(budgetTransactions);
    const actual = acceptedTransactions.reduce((total, t) => {
      total += t.amount;
      return total;
    },0);

    return {
      ...budget,
      ...budgetCurrentRange,
      actual,
      categories: budgetCategories.map(cId => categoriesMap[cId]),
      transactions: budgetTransactions.sort(util.sortJsonFN([
        {name: 'date'}
      ]))
    }
  },

  getBudgetsUsage(budgets) {
  
    //Calculating budgets cumulative limit, Creating transactions array
    let budgetTransactions = [];
    const cumulativeLimit = budgets.reduce((cumulativeLimit, b) => {

      const isYearlyBudget = b.period === 'YEARLY';
      cumulativeLimit += Math.round(b.limit / (isYearlyBudget ? 12 : 1));

      b.transactions.forEach(t => budgetTransactions.push(t));
      return cumulativeLimit;
    }, 0);

    //Summing budget transactions
    const acceptedTransactions = transactionService.filterAccepted(budgetTransactions);
    const budgetsActual = acceptedTransactions.reduce((total, transaction) => {

      total += transaction.amount;
      return total;
    }, 0);

    const hasLimit = cumulativeLimit > 0;
    const usage = hasLimit ? Math.round((budgetsActual / cumulativeLimit) * 100) : 0;

    const indicatorColor = usage < 50 ? 'success' : usage > 90 ? 'overage' : 'warning';

    return {
      limit: cumulativeLimit,
      actual: budgetsActual,
      usage,
      indicatorColor
    };
  }
}

const budgetPath = (projectId, budgetId) => `/projects/${projectId}/budgets/${budgetId}`;

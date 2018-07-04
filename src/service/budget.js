
export default {

  getBudgetStatusIndicator: budget => {

    const actual = budget.actual, limit = budget.limit;
    const budgetUsage = (actual / limit) * 100;

    return `${budgetUsage <= 45 ? 'success' : budgetUsage <= 55 ? 'warning' : 'overage'}-indicator`;
  }
}

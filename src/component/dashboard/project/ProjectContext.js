import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import transactionsService from '@service/transaction';
import projectService from '@service/project';
import budgetService from '@service/budget';
import util from '@util/';

const ProjectContext = React.createContext();

const getContextTransactions = (transactions, customers, categories, users) => {

  return transactions ? transactionsService.mergeTransactions(
    transactions,
    customers,
    categories,
    users
    ).sort(util.sortJsonFN([{name: 'date'}]))
    : []
};

const getContextBudgets = (budgets, filledTransactions, customers, categories, users) => {
  return filledTransactions.length > 0 ? budgetService.mergeBudgets(
    budgets,
    categories,
    filledTransactions,
    customers,
    users
  ) : []
};

class ProjectProvider extends Component {

  static propTypes = {
    project: PropTypes.object,
    budgets: PropTypes.array,
    transactions: PropTypes.array,
    customers: PropTypes.array,
    categories: PropTypes.array,
    members: PropTypes.array,
    events: PropTypes.array,
    users: PropTypes.array,
    balance: PropTypes.object,
  };

  prepareContext = () => {

    const {
      budgets,
      transactions,
      customers,
      categories,
      events,
      members,
      users,
      balance,
      project
    } = this.props;

    const contextTransactions = transactions ? getContextTransactions(transactions, customers, categories, users) : [];

    const contextWrapper = {
      contextProject: project,
      contextCustomers: customers,
      contextCategories: categories,
      contextTransactions,
      contextBudgets: getContextBudgets(budgets, contextTransactions, customers, categories, users),
      contextUsers: users,
      contextMembers: projectService.mergeProjectMembers(members, users),
      contextEvents: events,
      contextBalance: balance
    };

    const contextKeys = Object.keys(contextWrapper);

    return contextKeys.reduce((context, key) => {
      const usableKey = key.replace("context", "").toLowerCase();
      context[usableKey] = contextWrapper[key];
      return context;
    }, {});

  };

  render() {

    const context = this.prepareContext();
    console.log("Context ready")
    return <ProjectContext.Provider value={context}>
      {this.props.children}
    </ProjectContext.Provider>
  }
}

export default connect(state => ({
  project: state.project.selectedProject,
  balance: state.project.selectedProject.balance,
  budgets: state.project.budgets,
  transactions: state.project.transactions,
  categories: state.project.categories,
  customers: state.project.customers,
  events: state.project.events,
  members: state.project.members,
  users: state.dashboard.users,
}), {})(ProjectProvider);

export {
  ProjectContext,
};



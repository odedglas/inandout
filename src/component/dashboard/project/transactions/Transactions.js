import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import TransactionsTableView from './TransactionsTableView';
import Breadcrumb from '../breadcrumbs/Breadcrumb';

import {TransactionType} from "@model/transaction";

class Transactions extends Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionType),
    selectedProject: PropTypes.object,
  };

  render() {
    const { transactions, selectedProject } = this.props;

    return (
      <div className={'transactions-container'}>
        <Breadcrumb item={{id:'transactionsCrumb' ,value:'Transactions', path:'/dashboard'}}/>

        <TransactionsTableView transactions={transactions}
                               projectCurrency={selectedProject.currency}/>
      </div>
    );
  }
}

export default connect(state => ({
  transactions: state.project.transactions,
  selectedProject: state.project.selectedProject,
}), {})(Transactions);
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import TransactionsTableView from './tableview/TransactionsTableView';
import Breadcrumb from '../breadcrumbs/Breadcrumb';

import PageTitle from "@common/PageTitle";
import {TransactionType} from "@model/transaction";

import transactionsService from '@service/transaction';

class Transactions extends Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.object)
  };

  state = {
    filledTransactions: PropTypes.arrayOf(TransactionType)
  };

  static getDerivedStateFromProps(props, state) {

    const {transactions, categories, customers, users} = props;

    return {
      filledTransactions: transactionsService.mergeTransactions(
        transactions,
        customers,
        categories,
        users
      )
    }
  }

  handleTransactionFill = (transaction) => {

    const {categories, customers, users} = this.props;
    return transactionsService.mergeTransactions([transaction], customers, categories, users)[0]
  };

  render() {
    const { filledTransactions } = this.state;

    return (
      <div className={'transactions-container'}>
        <Breadcrumb item={{id:'transactionsCrumb' ,value:'Transactions', path:'/dashboard'}}/>
        <PageTitle text={'Transactions'} icon={'transactions'}/>

        <div className={'px-4'}>
          <TransactionsTableView transactions={filledTransactions} fillTransaction={this.handleTransactionFill}/>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  transactions: state.project.transactions,
  categories: state.project.categories,
  customers: state.project.customers,
  users: state.dashboard.users,
}), {})(Transactions);
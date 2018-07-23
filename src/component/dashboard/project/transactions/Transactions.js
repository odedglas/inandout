import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import TransactionsTableView from './TransactionsTableView';
import Breadcrumb from '../breadcrumbs/Breadcrumb';

import PageTitle from "@common/PageTitle";
import {TransactionType} from "@model/transaction";

class Transactions extends Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionType)
  };

  render() {
    const { transactions } = this.props;

    return (
      <div className={'transactions-container'}>
        <Breadcrumb item={{id:'transactionsCrumb' ,value:'Transactions', path:'/dashboard'}}/>
        <PageTitle text={'Transactions'} icon={'transactions'}/>

        <div className={'px-4'}>
          <TransactionsTableView transactions={transactions}/>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  transactions: state.project.transactions,
}), {})(Transactions);
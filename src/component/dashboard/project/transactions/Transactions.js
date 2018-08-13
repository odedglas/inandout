import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import TransactionsTableView from './tableview/TransactionsTableView';
import Breadcrumb from '../breadcrumbs/Breadcrumb';

import PageTitle from "@common/PageTitle";
import {TransactionType} from "@model/transaction";
import {ProjectContext} from '../ProjectContext';

import transactionsService from '@service/transaction';

class Transactions extends Component {

  handleTransactionFill = (transaction) => {

    const {categories, customers, users} = this.props;
    return transactionsService.mergeTransactions([transaction], customers, categories, users)[0]
  };

  render() {
    return (
      <div className={'transactions-container'}>
        <Breadcrumb item={{id: 'transactionsCrumb', value: 'Transactions'}}/>
        <ProjectContext.Consumer>
          {(projectContext) => (
            <div>
              <PageTitle text={'Transactions'} icon={'transactions'}/>

              <div className={'px-4'}>
                <TransactionsTableView transactions={projectContext.transactions}
                                       fillTransaction={this.handleTransactionFill}/>
              </div>
            </div>
          )}
        </ProjectContext.Consumer>

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
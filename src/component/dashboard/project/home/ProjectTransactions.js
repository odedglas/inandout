import React from 'react';
import PropTypes from 'prop-types';

import TransactionsSummary from '../transactions/TransactionsSummaryTable';
import {TransactionType} from "@model/transaction";

class ProjectTransactions extends React.Component {

  static propTypes = {
    transactions: PropTypes.arrayOf(TransactionType),
  };

  render() {
    const {transactions} = this.props;

    return (
      <div>
        <TransactionsSummary transactions={transactions}/>
      </div>
    );
  }
}


export default ProjectTransactions;
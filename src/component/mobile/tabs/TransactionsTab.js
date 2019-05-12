import React from 'react';
import TransactionsList from '../lists/TransactionsList';

const TransactionsTab = ({project, transactions}) => {

  return (
    <div className={'tab transactions-tab row'}>

      <div className={'col-12 px-0 transactions-wrapper'}>
        <TransactionsList transactions={transactions}
                          currency={project.currency}/>
      </div>
    </div>
  );

};
export default TransactionsTab;
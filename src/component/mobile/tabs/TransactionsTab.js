import React from 'react';
import util from '@util/'
import {TRANSACTIONS_PAYMENT_METHODS} from '@const/';
import dateUtil from '@util/date'
import DynamicIcon from '@common/DynamicIcon';
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
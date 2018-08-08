import React from 'react';
import util from '@util/'
import DynamicIcon from "../../../../common/DynamicIcon";

export default ({currency, income, outcome, balance}) => {

  const isPositiveBalance = balance >= 0;

  return (
    <div className={'transactions-balance mt-2'}>
      <div className={'item'}>
        <div className={'title mb-2'}>
          <span className={'income'}>
          {util.formatNumber(income, currency)}
          </span>
        </div>
        <div className={'item-body'}>
          <DynamicIcon className={'income'} name={'income'}/>
          <span>Incomes</span>
        </div>
      </div>
      <div className={'item'}>
        <div className={'title mb-2'}>
          <span className={'outcome'}>
          {util.formatNumber(outcome, currency)}
          </span>
        </div>
        <div className={'item-body'}>
          <DynamicIcon className={'outcome'} name={'outcome'}/>
          <span>Outcomes</span>
        </div>
      </div>
      <div className={'item'}>
        <div className={'title mb-2'}>
          <span className={isPositiveBalance ? 'income' : 'outcome'}>
          {util.formatNumber(balance, currency)}
          </span>
        </div>
        <div className={'item-body'}>
          <DynamicIcon className={'balance'} name={'balance'}/>
          <span>Balance</span>
        </div>
      </div>
    </div>
  )
}

//#9cadc2
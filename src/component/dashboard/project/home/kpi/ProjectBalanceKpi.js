import React from 'react';
import util from '@util/'
import DynamicIcon from "@common/DynamicIcon";

export default ({balance, currency, created, selectedDate}) => {

  const positive = balance >= 0;
  const cls = `${positive ? 'income' : 'outcome'} balance-holder py-2`;

  return (
    <div className={'project-balance'}>
      <div className={cls}>
        { util.formatNumber(balance, currency) }
      </div>
      <div className={'project-range'}>
        {created}
        <DynamicIcon className={'mx-2'} name={'toArrow'}/>
        {selectedDate}
      </div>
    </div>
  )
}

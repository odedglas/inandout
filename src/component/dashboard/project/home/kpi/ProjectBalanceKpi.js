import React from 'react';
import util from '@util/'
import dateUtil from '@util/date'
import DynamicIcon from "@common/DynamicIcon";

export default ({balance, currency, created, selectedDate}) => {

  const positive = balance >= 0;
  const cls = `${positive ? 'income' : 'outcome'} balance-holder py-2`;

  const isBeforeCreated = !dateUtil.sameMonth(selectedDate, created) && dateUtil.isBefore(selectedDate, created);
  const isToday = dateUtil.sameMonth(selectedDate, dateUtil.now());

  return (
    <div className={'project-balance'}>
      <div className={cls}>
        {util.formatNumber(balance, currency)}
      </div>
      <div className={'project-range'}>
        { !isBeforeCreated ? dateUtil.formatShortMont(created) : ' -- '}
        <DynamicIcon className={'mx-2'} name={'toArrow'}/>
        {isToday ? 'Today' : dateUtil.formatShortMont(selectedDate)}
      </div>
    </div>
  )
}

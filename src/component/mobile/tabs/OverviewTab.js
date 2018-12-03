import React from 'react';
import util from '@util/'
import {TRANSACTIONS_PAYMENT_METHODS} from '@const/';
import dateUtil from '@util/date'
import DynamicIcon from '@common/DynamicIcon';
import TransactionsList from '../lists/TransactionsList';

const ProjectHeader = ({project, selectedDate, overall, currency}) => {

  const created = project.created;
  const isBeforeCreated = !dateUtil.sameMonth(selectedDate, created) && dateUtil.isBefore(selectedDate, created);
  const isToday = dateUtil.sameMonth(selectedDate, dateUtil.now());

  return (
    <div className={'row project-header mb-2'}>
      <div className={'col-6'}>
        <div className={'title'}>
          Project
        </div>
        {project.name}
      </div>
      <div className={'overall col-flex just-c'}>
        <div className={'project-range just-c'}>
          {!isBeforeCreated ? dateUtil.formatShortMont(created) : ' -- '}
          <DynamicIcon className={'mx-2'} name={'toArrow'}/>
          {isToday ? 'Today' : dateUtil.formatShortMont(selectedDate)}
        </div>
        <span> {util.formatNumber(overall, currency)} </span>
      </div>
    </div>
  );
};

const MonthlyHeader = ({currency, balance}) => {

  return (
    <div className={'balance-container px-0 row'}>
      <div className={'col-6 balance'}>
        <div className={'title'}>
          Balance
        </div>
        <div className={'amount'}>
          {util.formatNumber(balance.balance, currency)}
        </div>
      </div>
      <div className={'col-6 px-0'}>
        <div className={'income-container'}>
          <div className={'title'}>
            Income
          </div>
          <div className={'amount income'}>
            +{util.formatNumber(balance.income, currency)}
          </div>
        </div>

        <div className={'outcome-container'}>
          <div className={'title'}>
            Outcome
          </div>
          <div className={'amount outcome'}>
            -{util.formatNumber(balance.outcome, currency)}
          </div>
        </div>
      </div>
    </div>
  );
};

const LastActivity = ({transactions, currency}) => {

  return (
    <div className={'col-12 last-activity px-0'}>
      <TransactionsList transactions={transactions} currency={currency}/>
    </div>
  );
};

const OverviewTab = ({project, transactions, overall, balance, selectedDate, currency}) => {

  const hasTransactions = transactions.length > 0;

  return (
    <div className={'tab overview-tab row'}>
      <div className={'mx-2 mt-3 w-100'}>

        <div className={'card-title'}> Overall</div>
        <ProjectHeader project={project}
                       overall={overall}
                       selectedDate={selectedDate}
                       currency={currency}/>

        <div className={'card-title'}> {dateUtil.formatShortMont(selectedDate)} </div>
        <MonthlyHeader currency={currency}
                       balance={balance}/>

        {
          hasTransactions && <div>
            <div className={'card-title mt-3 '}>
              <div className={'flex pt-2 px-2'}>
                <span> <DynamicIcon name={'history'}/> </span>
                <span style={{fontSize: '1rem'}} className={'mx-2'}> Last Activity </span>
              </div>
            </div>
            <LastActivity transactions={transactions} currency={currency}/>
          </div>
        }
      </div>
    </div>
  );

};
export default OverviewTab;
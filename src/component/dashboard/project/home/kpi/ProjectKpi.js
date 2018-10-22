import React from 'react';

import ProjectKpiCard from './ProjectKpiCard';
import TransactionsBalanceKpi from './TransactionsBalanceKpi';
import BudgetsUsageKpi from './BudgetsUsageKpi';
import ProjectBalanceKpi from './ProjectBalanceKpi';

import dateUtil from '@util/date';

const formatShort = date => dateUtil.format(date, 'MMM YY');

export default  ({indicators, project, selectedDate }) => {

  const currency = project.currency;

  return (
    <div className={'col-sm-12 px-0 row'}>

      <div className={'col-sm-12 col-md-6'}>
        <ProjectKpiCard title={'Monthly Balance'}
                        body={<TransactionsBalanceKpi currency={currency}
                                                      {...indicators.monthlyBalance}/>}
                        badgeText={formatShort(selectedDate)}>
        </ProjectKpiCard>
      </div>

      <div className={'col-sm-6 mt-3 col-md-3 mt-md-0'}>
        <ProjectKpiCard title={'Budgets usage'}
                        body={<BudgetsUsageKpi currency={currency}
                                               {...indicators.budgetsUsage}/>}
                        badgeText={formatShort(selectedDate)}>
        </ProjectKpiCard>
      </div>

      <div className={'col-sm-6 mt-3 col-md-3 mt-md-0'}>
        <ProjectKpiCard title={'Project Balance'}
                        badgeText={'Overall'}
                        body={<ProjectBalanceKpi currency={currency}
                                                 created={formatShort(project.created)}
                                                 selectedDate={formatShort(selectedDate)}
                                                 balance={indicators.totalBalance}/>}>

        </ProjectKpiCard>
      </div>

    </div>
  );
}
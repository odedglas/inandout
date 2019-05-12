import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from "@material-ui/core/ButtonBase";

import DynamicIcon from '@common/DynamicIcon';
import CreateBudget from '@modal/CreateBudget'

import util from '@util/'
import dateUtil from '@util/date'
import budgetService from '@service/budget';

const formatBudgetSummaryRange = date => dateUtil.format(date, 'Do MMM');

const BudgetsHeader = ({ indicator, selectedDate }) => {

  const indicatorCls = `${indicator.indicatorColor}-indicator`;
  const progressSpanStyle = {
    width: `${100-indicator.usage}%`,
  };
  const safeToSpend = indicator.limit - indicator.actual;
  const { start, end } = dateUtil.periodRange(selectedDate, 'Do MMM');
  const isSelectedThisMonth = dateUtil.sameMonth(selectedDate, new Date());

  return (
    <div className={'p-2 header flex w-100'}>

      <div className={'indicator-wrapper'}>
        <div className={'header-title text-center'}> Budget's Usage </div>
        <div className={'usage-indicator'}>
          <div className={'content'}>
            <div className={`usage ${indicatorCls}`}>
              {indicator.usage}%
            </div>
          </div>
          <CircularProgress
            className={'backdrop'}
            variant="determinate"
            value={100}
            size={75}
            thickness={4}
          />
          <CircularProgress
            className={`progress ${indicatorCls}`}
            variant="static"
            value={indicator.usage}
            size={75}
            thickness={4}
          />
        </div>
      </div>

      <div className={'safe-to-spent px-2 pb-2'}>
        <div className={'header-title'}> Safe to spent </div>
        <div>
          <div> {util.formatNumber(safeToSpend) } out of {util.formatNumber(indicator.limit)} </div>
          <div className={'progress-bar my-2'}>
            <span className={`${indicator.indicatorColor}-background`} style={progressSpanStyle}/>
          </div>
          <div className={'dates flex'}>
            <div>{isSelectedThisMonth ? formatBudgetSummaryRange(new Date()) : start}</div>
            <div>{end}</div>
          </div>
        </div>
      </div>

    </div>
  )
};

const BudgetRow = ({ budget, onEdit }) => {

  const budgetIndicator = budgetService.getBudgetStatusIndicator(budget);

  return (
    <ButtonBase className={'w-100'} onClick={() => onEdit(budget)}>
      <div className={'budget-row'}>
        <div className={'flex-between'}>
          <div className={'font-normal'}>{budget.name}</div>
          <div className={'budget-range'}>
            {formatBudgetSummaryRange(budget.startDate)}
            <DynamicIcon className={'mx-2'} name={'toArrow'}/>
            {formatBudgetSummaryRange(budget.endDate)}
          </div>
        </div>
        <div>
          <div className={'flex-end mb-2'}>
            {
              budget.categories.map(category => (
                <div key={category.id} className={'category'}>
                  <Avatar className={'avatar smaller mx-1'} style={{'backgroundColor': category.color}}>
                    <DynamicIcon className={'icon'} name={category.icon}/>
                  </Avatar>
                </div>
              ))
            }
          </div>
          <div className={'budget-usage text-right font-normal'}>
            <span className={budgetIndicator.className}> {util.formatNumber(budget.actual) } </span> / {util.formatNumber(budget.limit)}
          </div>
        </div>
      </div>
    </ButtonBase>
  );

};

class BudgetsTab extends React.Component {

  state = {
    showCreateBudgetModal: false,
  };

  showHideCreateBudge = (show, budget) => {

    if (show) {
      this.setState({
        showCreateBudgetModal: true,
        budgetForEdit: budget || {}
      })
    }
    else {

      this.setState({showCreateBudgetModal: false});
    }

  };

  render () {

    const {project, indicator, selectedDate, budgets} = this.props;
    const {budgetForEdit, showCreateBudgetModal} = this.state;

    return (
      <div className={'tab budgets-tab row'}>

        <BudgetsHeader indicator={indicator} selectedDate={selectedDate}/>

        <div className={'col-sm-12 mt-3 budgets-wrapper px-0'}>
          {
            budgets.map(budget => ( <BudgetRow key={budget.id}
                                               onEdit={(budget) => this.showHideCreateBudge(true, budget)}
                                               budget={budget}/> ))
          }
        </div>
        <CreateBudget open={showCreateBudgetModal}
                      budget={budgetForEdit}
                      project={project}
                      onClose={this.showHideCreateBudge}/>
      </div>
    );
  }


}

export default BudgetsTab;
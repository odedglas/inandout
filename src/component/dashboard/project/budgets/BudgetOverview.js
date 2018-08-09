import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import date from '@util/date';
import themeService from '@service/theme';
import {BudgetType} from '@model/budget'

class BudgetOverview extends Component {

  static propTypes = {
    budget: BudgetType,
    visible: PropTypes.bool,
    indicator: PropTypes.object
  };

  render() {

    const {budget, visible, indicator} = this.props;

    const startDate = date.budgetRangeFormat(budget.startDate);
    const endDate = date.budgetRangeFormat(budget.endDate);

    const usageAsWidth = indicator.usage.replace(" ", "").trim();
    const expectedAsWidth = indicator.expectedUsage.replace(" ", "").trim();
    const actualWidth = visible ? usageAsWidth : 0;

    const actualStyle = {
      backgroundColor: themeService.withOpacity(indicator.color, 0.8),
      width: actualWidth
    };

    const useTransparentExpected = indicator.expected < 5;

    const tooltip = `Budget actual value is: ${budget.actual} While expected value is: ${indicator.expected} \n ${indicator.message}`;

    return (
      <div className={'budget-overview-wrapper row'}>
        <div className={'col-sm-12 flex px-0'}>
          <Tooltip title={'Budget start date is: ' + startDate}
                   placement={'right'}
                   enterDelay={200}>
           <div className={'label-date'}>{startDate}</div>
          </Tooltip>
          <div className={'flex'}> </div>
          <Tooltip title={'Budget end date is: ' + endDate}
                   enterDelay={200}
                   placement={'left'}>
           <div className={'label-date'}>{endDate}</div>
          </Tooltip>
        </div>
        <Tooltip title={tooltip}
                 enterDelay={200}
                 placement={'top'}>
          <div className={'col-sm-12 body px-0 my-2'}>
            <div className={'actual'} style={actualStyle}>
            </div>
            <span className={'text'}> {indicator.usage} </span>
            <div className={`expected ${useTransparentExpected ? 'transparent' : ''}`} style={{left: expectedAsWidth }}>
            </div>
          </div>
        </Tooltip>
        <div className={'col-sm-12 flex px-0'}>
          <div className={'label-limit'}>0</div>
          <div className={'flex'}> </div>
          <Tooltip title={'Budget limit is: ' + budget.limit}
                   enterDelay={200}
                   placement={'left'}>
            <div className={'label-limit'}>{budget.limit}</div>
          </Tooltip>
        </div>
      </div>
    );
  }
}

export default BudgetOverview;
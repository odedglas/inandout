import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TransactionsSummary from '../transactions/TransactionsSummaryTable';
import {DIRECTIONS} from '@const/';
import {TransactionType} from "@model/transaction";
import DynamicIcon from "@common/DynamicIcon";
import util from '@util/';
import {ProjectType} from "@model/project";

const tabs = [
  {
    key: 'income',
    label: 'Incomes',
    income: true,
    getData: transactions => transactions.filter(t => t.income)
  },
  {
    key: 'outcome',
    label: 'Outcomes',
    getData:  transactions => transactions.filter(t => !t.income)
  },
];
const incomeTabIndex = 0, outcomeTabIndex = 1;

class ProjectTransactions extends React.Component {

  static propTypes = {
    selectedProject: ProjectType,
    transactions: PropTypes.arrayOf(TransactionType),
  };

  state = {
    activeTabIndex: 0,
  };

  componentDidMount() {
    const {transactions} =  this.props;
    this.setInitialActiveTab(transactions,);
  }

  componentWillReceiveProps(nextProps) {

    const lastProjectId = this.props.selectedProject && this.props.selectedProject.id;
    const nextProjectId = nextProps.selectedProject && nextProps.selectedProject.id;

    if (lastProjectId !== nextProjectId) {

      this.setInitialActiveTab(nextProps.transactions);
    }
  }

  setInitialActiveTab(transactions) {

    const incomes = tabs[incomeTabIndex].getData(transactions);
    const outcomes = tabs[outcomeTabIndex].getData(transactions);

    this.setState({
      activeTabIndex: (incomes.length === 0 && outcomes.length > 0) ? outcomeTabIndex : incomeTabIndex
    });
  }

  handleChange = (event, value) => {
    this.setState({activeTabIndex: value});
  };

  handleChangeIndex = index => {
    this.setState({activeTabIndex: index});
  };

  renderTransactionsTab = tab => {

    const {transactions} = this.props;

    const income = tab.income;
    const data = tab.getData(transactions)
      .sort(util.sortJsonFN([{name: 'date'}]));

    return (
      <TransactionsSummary showIncomes={income}
                           emptyMessage={`There are no ${tab.label} to display`}
                           transactions={data}/>
    );
  };

  render() {

    const direction = DIRECTIONS.LTR;

    return (
      <div className={'project-transactions'}>
        <div className={'sub-header'}>
          <span style={{display: 'flex'}}> <DynamicIcon name={'history'}/> </span>
          <span className={'mx-3 title'}> Last Activity </span>
        </div>
        <div>
          <Tabs
            value={this.state.activeTabIndex}
            onChange={this.handleChange}
            indicatorColor="primary"
            className={'tabs'}
            textColor="primary"
            fullWidth
          >
            {tabs.map(tab => <Tab key={tab.key}
                                  className={'tab'}
                                  label={tab.label}/>)}

          </Tabs>
        </div>
        <SwipeableViews
          axis={direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.activeTabIndex}
          onChangeIndex={this.handleChangeIndex}
        >
          {tabs.map(tab => <div key={tab.key}> {this.renderTransactionsTab(tab)} </div>)}

        </SwipeableViews>
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {})(ProjectTransactions);
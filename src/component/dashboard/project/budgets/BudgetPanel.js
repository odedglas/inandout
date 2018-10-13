import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {
  withRouter,
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';

import DynamicIcon from "@common/DynamicIcon";
import IconButton from '@material-ui/core/IconButton';
import TransactionsSummary from '../transactions/TransactionsSummaryTable';
import BudgetOverview from './BudgetOverview';
import {BudgetType} from '@model/budget'
import {ProjectType} from "@model/project";
import {deleteBudget} from "@action/project";
import {showConfirmation} from "@action/dashboard";

import navgationUtil from '@util/navigation';
import budgetService from '@service/budget';
import dateUtil from '@util/date';

const formatShort = date => dateUtil.format(date, 'Do MMM YY');

class BudgetPanel extends Component {

  static propTypes = {
    project: ProjectType,
    budget: BudgetType,
    expanded: PropTypes.bool,
    editBudget: PropTypes.func.isRequired,
    onExpandChange: PropTypes.func,
    deleteBudget: PropTypes.func.isRequired,
    showConfirmation: PropTypes.func.isRequired,
    showBudgetStatistics: PropTypes.func.isRequired,
    showCreateTransaction: PropTypes.func.isRequired,
  };

  handleExpandStateChange = () => {

    const expanded = !this.props.expanded;

    this.props.onExpandChange(
      expanded ? this.props.budget.id : undefined
    );

  };

  handleEditBudge = () => {

    this.props.editBudget(this.props.budget);
  };

  handleBudgetRemove = () => {

    const {budget, deleteBudget, showConfirmation, project} = this.props;

    showConfirmation({
      title: 'Remove This Budget ?',
      body: 'Removing this budget will delete it permanently',
      icon: 'delete',
      onConfirm: () => {

        deleteBudget(project, budget.id);
      }
    });

  };

  gotoTransactions = () => {

    const {history, budget} = this.props;

    history.push({
      pathname: navgationUtil.projectLink(this.props.project, 'transactions'),
      state: {
        initialFilter: [
          {
            filterId: "category",
            operator: "in",
            value: budget.categories.map(c => c.id)
          }
        ]
      }
    })
  };

  budgetSummary = (budgetIndicator) => {

    const {budget} = this.props;

    return (
      (
        <div className={'row budget-summary'}>
          <div className={'col-sm-9 row'}>
            <div className={'col-sm-4'}>
              <Typography className={'budget-name'}>{budget.name}</Typography>
            </div>
            <div className={'col-sm-4 budget-range'}>
              {formatShort(budget.startDate)}
              <DynamicIcon className={'mx-2'} name={'toArrow'}/>
              {formatShort(budget.endDate)}
            </div>
            <div className={'col-sm-4'}>
                              <span className={'usage'}>
                Budget Usage:
              </span>
              <span className={'mx-2 ' + budgetIndicator.className}>
                {budget.actual}
              </span>
              <span className={'separator'}>
                /
              </span>
              <span className={'limit mx-2'}>
                {budget.limit}
              </span>
            </div>
          </div>

          <div className={'col-sm-3 flex-center'}>
            <div className={'flex categories'}>
              {
                budget.categories.map(category => (
                  <div key={category.id} className={'category'}>
                    <Avatar className={'avatar small mx-1'} style={{'backgroundColor': category.color}}>
                      <DynamicIcon className={'icon'} name={category.icon}/>
                    </Avatar>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )
    )
  };

  budgetContent = (budgetIndicator) => {

    const {budget, expanded} = this.props;
    const hasTransactions = budget.transactions.length > 0;

    return (
      <div>
        <div className={'row flex overview mb-3'}>
          <div className={'col-sm-12 row mb-3'}>
            <div className={'col-sm-12 px-4'}>
              <BudgetOverview budget={budget} visible={expanded} indicator={budgetIndicator}/>
            </div>
          </div>
        </div>
        {
          hasTransactions ? (
            <div>
              <div className={'row flex transactions'}>
                <div className={'col-sm-12'}>
              <span className={'transactions-title'}>
                 <DynamicIcon name={'history'} className={'icon'}/>
                Latest Activity
              </span>
                </div>
                <div className={'col-sm-12'}>
                  <TransactionsSummary transactions={budget.transactions}/>
                </div>
              </div>
            </div>
          ) : this.noTransactionsDisplay()
        }
      </div>
    )
  };

  noTransactionsDisplay = () => {
    const {budget, showCreateTransaction} = this.props;

    return (
      <div className={'row'}>
        <div className={'col-sm-12 mt-2 empty-transactions'}>
         <span className={'text'}>
           There are no transactions listed under this budget's categories yet.
         </span>
          <Button size="small" color="primary" className={'mt-3'} onClick={() => showCreateTransaction(budget)}>
            <DynamicIcon name={'add'}/>
            Create Transaction
          </Button>
        </div>
      </div>
    )
  };

  render() {

    const {expanded, budget, showBudgetStatistics} = this.props;
    const containerCls = `budget-panel mx-3 ${expanded ? 'expanded' : ''}`;
    const budgetIndicator = budgetService.getBudgetStatusIndicator(budget);
    const hasTransactions = budget.transactions.length > 0;

    return (
      <ExpansionPanel className={containerCls}
                      expanded={expanded}
                      onChange={this.handleExpandStateChange}>

        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon/>} className={'budget-summary-head'}>
          {this.budgetSummary(budgetIndicator)}
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={'budget-content'}>
          {this.budgetContent(budgetIndicator)}
        </ExpansionPanelDetails>
        <Divider/>
        <ExpansionPanelActions className={'actions'}>
          <IconButton className={'delete-budget mx-2'} onClick={this.handleBudgetRemove}>
            <DynamicIcon name={'delete'}/>
          </IconButton>
          <div className={'flex'}>
          </div>
          <Button size="small" onClick={this.handleExpandStateChange}>
            <DynamicIcon className={'icon'} color="secondary" name={'close'}/>
            Close
          </Button>
          {
            hasTransactions ? <div>
              <Button size="small" color="primary" onClick={this.gotoTransactions}>
                <DynamicIcon className={'icon'} name={'transactions'}/>
                Transactions
              </Button>
              {/*<Button size="small" color="primary" onClick={() => showBudgetStatistics(budget)}>
                <DynamicIcon className={'icon'}  name={'chart'}/>
                Statistics
              </Button>*/}
            </div> : null
          }
          <Button size="small" color="primary" onClick={this.handleEditBudge}>
            <DynamicIcon className={'icon'} name={'edit'}/>
            Edit
          </Button>

        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

export default compose(
  withRouter,
  connect(null, {
    deleteBudget,
    showConfirmation
  })
)(BudgetPanel);

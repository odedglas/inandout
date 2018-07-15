import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

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
import Tooltip from '@material-ui/core/Tooltip';
import TransactionsSummary from '../transactions/TransactionsSummaryTable';
import BudgetOverview from './BudgetOverview';
import {BudgetType} from '@model/budget'
import {deleteBudget} from "@action/project";
import {showConfirmation} from "@action/dashboard";

import budgetService from '@service/budget';

class BudgetPanel extends Component {

  static propTypes = {
    budget: BudgetType,
    expanded: PropTypes.bool,
    editBudget: PropTypes.func.isRequired,
    onExpandChange: PropTypes.func,
    deleteBudget: PropTypes.func.isRequired,
    showConfirmation: PropTypes.func.isRequired,
    showBudgetStatistics: PropTypes.func.isRequired,
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

    const {budget, deleteBudget, showConfirmation, selectedProject} = this.props;

    showConfirmation({
      title:'Remove This Budget ?',
      body: 'Removing this budget will delete it permanently',
      icon: 'delete',
      onConfirm: () => {

        deleteBudget(selectedProject, budget.id);
      }
    });

  };

   budgetSummary = (budgetIndicator) => {

     const {budget} =  this.props;

     return (
       (
         <div className={'row budget-summary'}>
           <div className={'col-sm-8 row'}>
             <div className={'col-sm-6'}>
               <Typography className={'budget-name'}>{budget.name}</Typography>
             </div>
             <div className={'col-sm-6'}>
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

           <div className={'col-sm-4 flex categories'}>
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
       )
     )
   };

   budgetContent = (budgetIndicator) => {

     const {budget, expanded} =  this.props;
     const hasTransactions = budget.transactions.length > 0;

     return (
       <div>
         <div className={'row flex overview mb-3'}>
           <div className={'col-sm-12'}>
            <span className={'overview-title mb-3'}>
               <DynamicIcon name={'overview'} className={'icon'}/>
               Overview
            </span>
           </div>
           <div className={'col-sm-12 row'}>
             <div className={'col-sm-12 px-4'}>
               <BudgetOverview budget={budget} visible={expanded} indicator={budgetIndicator} />
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

   noTransactionsDisplay = () => (
     <div className={'row'}>
       <div className={'col-sm-12 mt-2 empty-transactions'}>
         <span className={'text'}>
           There are no transactions listed under this budget's categories yet.
         </span>
         <Button size="small" color="primary" className={'mt-3'}>
           <DynamicIcon name={'add'}/>
           Create Transaction
         </Button>
       </div>
     </div>
   );

  render() {

    const {expanded, budget, showBudgetStatistics} =  this.props;
    const containerCls = `budget-panel mx-3 ${expanded ? 'expanded' : ''}`;
    const budgetIndicator = budgetService.getBudgetStatusIndicator(budget);
    const hasTransactions = budget.transactions.length > 0;

    return (
      <ExpansionPanel className={containerCls}
                      expanded={expanded}
                      onChange={this.handleExpandStateChange}>

        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          {this.budgetSummary(budgetIndicator)}
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={'budget-content'}>
          {this.budgetContent(budgetIndicator)}
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions className={'actions'}>
          <Tooltip title={'Delete Budget'} placement={'right'}>
            <IconButton className={'delete-budget mx-2'} onClick={this.handleBudgetRemove}>
              <DynamicIcon name={'delete'}/>
            </IconButton>
          </Tooltip>
          <div className={'flex'}>
          </div>
          <Button size="small" onClick={this.handleExpandStateChange}>
            <DynamicIcon className={'icon'} color="secondary" name={'close'}/>
            Close
          </Button>
          {
            hasTransactions ? <Button size="small" color="primary" onClick={() => showBudgetStatistics(budget)}>
              <DynamicIcon className={'icon'}  name={'chart'}/>
              Statistics
            </Button> : null
          }
          <Button size="small" color="primary" onClick={this.handleEditBudge}>
            <DynamicIcon className={'icon'}  name={'edit'}/>
            Edit
          </Button>

        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject
}), {
  deleteBudget,
  showConfirmation
})(BudgetPanel);
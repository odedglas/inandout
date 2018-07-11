import React, {Component} from 'react';
import PropTypes from 'prop-types'

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
import TransactionsSummary from '../transactions/TransactionsSummaryTable';
import BudgetLineChart from './BudgetLineChart';
import BudgetCategoriesPieChart from './BudgetCategoriesPieChart';
import {BudgetType} from '@model/budget'

import budgetService from '@service/budget';

class BudgetPanel extends Component {

  static propTypes = {
    budget: BudgetType,
    expanded: PropTypes.bool,
    editBudget: PropTypes.func.isRequired,
    onExpandChange: PropTypes.func
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

   budgetSummary = () => {

     const {budget} =  this.props;
     const actualCls = budgetService.getBudgetStatusIndicator(budget).className;

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
               <span className={'mx-2 ' + actualCls}>
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

   budgetContent = () => {

     const {budget} =  this.props;
     const hasTransactions = budget.transactions.length > 0;

     return hasTransactions ? (
       <div>
         <div className={'row flex mb-3'}>
           <div className={'col-sm-12 mb-3'}>
              <span className={'statistics-title'}>
                <DynamicIcon name={'chart'} className={'icon'}/>
                Statistics
              </span>
           </div>
           <div className={'col-sm-7 divider row'}>
             <div className={'col-sm-12 budget-chart'}>
               <BudgetLineChart  budget={budget}/>
             </div>
             <div className={'col-sm-12 mt-3 usage-chart-label'}>
               Budget usage over time
             </div>
           </div>
           <div className={'col-sm-5 row'}>
             <div className={'col-sm-12 px-0 budget-chart'}>
               <BudgetCategoriesPieChart budget={budget} />
             </div>
             <div className={'col-sm-12 mt-3 usage-chart-label'}>
               Expenses by category
             </div>
           </div>
         </div>

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
     ) : this.noTransactionsDisplay();
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

    const {expanded} =  this.props;
    const containerCls = `budget-panel mx-3 ${expanded ? 'expanded' : ''}`;

    return (
      <ExpansionPanel className={containerCls}
                      expanded={expanded}
                      onChange={this.handleExpandStateChange}>

        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          {this.budgetSummary()}
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={'budget-content'}>
          {this.budgetContent()}
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions className={'actions'}>
          <Button size="small" onClick={this.handleExpandStateChange}>Close</Button>
          <Button size="small" color="primary" onClick={this.handleEditBudge}>
            Edit
          </Button>

        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

export default BudgetPanel;
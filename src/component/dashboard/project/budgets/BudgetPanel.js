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
import BudgetCargeoriesPieChart from './BudgetCargeoriesPieChart';
import {BudgetType} from '@model/budget'

import budgetService from '@service/budget';

class BudgetPanel extends Component {

  static propTypes = {
    budget: BudgetType
  };

  state = {
    expanded: false,
  };

  handleExpandStateChange = () => {

    this.setState((prevState, props) => ({
      expanded: !prevState.expanded
    }))
  };

  handleViewTransactions = () => {
    console.log("View transactions for budget -> " + this.props.budget.name);
  };

   budgetSummary = () => {

     const {budget} =  this.props;
     const actualCls = budgetService.getBudgetStatusIndicator(budget);

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
                   <Avatar className={'avatar mx-1'} style={{'backgroundColor': category.color}}>
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

   budgetContent = () => (
     <div>
       <div className={'row flex mb-4'}>
         <div className={'col-sm-12 mb-3'}>
                <span className={'statistics-title'}>
                  Statistics
                </span>
         </div>
         <div className={'col-sm-7 divider row'}>
           <div className={'col-sm-12'}>
             <BudgetLineChart />
           </div>
         </div>
         <div className={'col-sm-5'}>
           <BudgetCargeoriesPieChart />
         </div>
       </div>

       <div className={'row flex mx-3 transactions pt-3'}>
         <div className={'col-sm-12'}>
              <span className={'transactions-title'}>
                Latest Transactions
              </span>
         </div>
         <div className={'col-sm-12'}>
           <TransactionsSummary />
         </div>
       </div>
     </div>
   );

  render() {

    const {expanded} =  this.state;

    const containerCls = `budget-panel mx-3 ${expanded ? 'expanded' : ''}`;

    return (
      <ExpansionPanel className={containerCls} expanded={expanded}  onChange={this.handleExpandStateChange}>

        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          {this.budgetSummary()}
        </ExpansionPanelSummary>

        <ExpansionPanelDetails className={'budget-content'}>
          {this.budgetContent()}
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions className={'actions'}>
          <Button size="small" onClick={this.handleExpandStateChange}>Close</Button>
          <Button size="small" color="primary" onClick={this.handleViewTransactions}>
            View Transactions
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }
}

export default BudgetPanel;
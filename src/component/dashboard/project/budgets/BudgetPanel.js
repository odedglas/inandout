import React, {Component} from 'react';
import PropTypes from 'prop-types'

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';

import DynamicIcon from "@common/DynamicIcon";
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

  render() {

    const {budget} =  this.props;
    const {expanded} =  this.state;

    const categoriesCls = `col-sm-4 col-md-3 px-0 flex categories ${expanded ? 'expanded' : ''}`;
    const actualCls = budgetService.getBudgetStatusIndicator(budget);

    return (
      <ExpansionPanel className={'budget-panel mx-3'} expanded={expanded}  onChange={this.handleExpandStateChange}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>

          <div className={'row budget-summary'}>
            <div className={'col-sm-3 col-md-4'}>
              <Typography className={''}>{budget.name}</Typography>
            </div>
            <div className={'col-sm-3 col-md-4'}>
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
            <div className={categoriesCls}>
              {
                budget.categories.map(category => (
                  <div key={category.id} className={'category'}>
                    <Avatar className={'avatar mx-1'} style={{'backgroundColor': category.color}}>
                      <DynamicIcon className={'icon'} name={category.icon}/>
                    </Avatar>
                   {/* <span className={'category-name mt-1'}> {category.name} </span>*/}
                  </div>
                ))
              }
            </div>
          </div>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={'budget-content'}>
          <div className={'col-sm-4'}> 1</div>
          <div className={'col-sm-4'}>2</div>
          <div className={'col-sm-4'}> 3</div>
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
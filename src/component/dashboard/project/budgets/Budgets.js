import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';

import DynamicIcon from "@common/DynamicIcon";
import BudgetPanel from './BudgetPanel';
import PageTitle from "@common/PageTitle";

import Breadcrumb from '../breadcrumbs/Breadcrumb';

import CreateBudget from '@modal/CreateBudget'
import BudgetStatistics from '@modal/BudgetStatistics'
import {CategoryType} from "@model/category";
import budgetService from '@service/budget';

class Budgets extends Component {

  static propTypes = {
    budgets: PropTypes.arrayOf(PropTypes.object),
    transactions: PropTypes.arrayOf(PropTypes.object),
    categories: PropTypes.arrayOf(CategoryType),
    users: PropTypes.arrayOf(PropTypes.object),
    customers: PropTypes.arrayOf(PropTypes.object),
  };

  state = {
    expanded: null,
    showCreateBudgetModal: false,
    showBudgetStatisticsModal:false,
    budgetForEdit: {},
    budgetForStatistics: {},
    filledBudgets: [],
    expandStateChange: false,
  };

  static getDerivedStateFromProps(props, state) {

    if(!state.expandStateChange) {

      const {budgets, transactions, categories, customers, users} = props;

      return {
        filledBudgets: budgetService.mergeBudgets(
          budgets,
          categories,
          transactions,
          customers,
          users
        )
      }
    }

    return {
      expandStateChange: false
    }
  }

  handleExpandPanelChange = (budgetId) => {

    this.setState({expanded: budgetId, expandStateChange: budgetId !== this.state.expanded})
  };

  showHideCreateBudge = (show, budget) => {

    if(show) {
      this.setState({
        showCreateBudgetModal: true,
        budgetForEdit: budget || {}
      })
    }
    else {

      this.setState({showCreateBudgetModal: false});
    }

  };

  showHideBudgetStatistics = (show, budget) => {

    if(show) {
      this.setState({
        showBudgetStatisticsModal: true,
        budgetForStatistics: budget || {}
      });
    }
    else {

      this.setState({showBudgetStatisticsModal: false});
    }
  };

  render() {

    const {selectedProject} = this.props;
    const {expanded, filledBudgets, budgetForEdit, budgetForStatistics, showCreateBudgetModal, showBudgetStatisticsModal} = this.state;

    const hasBudgets = filledBudgets.length > 0;

    return (
      <div className={'budgets-container'}>

        <PageTitle text={'Budgets'} icon={'budgets'}/>

        <Breadcrumb item={{id: 'budgetsCrumb', value: 'Budgets', path: '/dashboard'}}/>

        <div className={'px-2 py-3'}>
        {
          filledBudgets.map(budget => <BudgetPanel key={budget.id}
                                             onExpandChange={this.handleExpandPanelChange}
                                             editBudget={(budget) => this.showHideCreateBudge(true, budget) }
                                             showBudgetStatistics={(budget) => this.showHideBudgetStatistics(true, budget)}
                                             expanded={expanded === budget.id}
                                             budget={budget}/>)
        }
        </div>

        {
          !hasBudgets ?
            <div className={'row'}>
              <div className={'col-sm-12 flex-center empty-budgets'}>
                <img className={'icon'} src={require('@img/cactus.svg')} alt="no-budgets" />
               <span className={'my-4 text'}>
                  There are no budgets yet...
               </span>
                <Button size="small" color="primary" onClick={() => this.showHideCreateBudge(true)}>
                  <DynamicIcon name={'add'}/>
                  Create Budget
                </Button>
              </div>
            </div>
            : null
        }

        <Tooltip title={'Create Budget'} placement={'top'} >
          <Zoom in={true} timeout={400}>
            <Button variant="fab"
                    color="secondary"
                    onClick={() => this.showHideCreateBudge(true)}
                    aria-label="add"
                    className={'fab'}>
              <DynamicIcon name={'add'}/>
            </Button>
          </Zoom>
        </Tooltip>


        <CreateBudget open={showCreateBudgetModal}
                      budget={budgetForEdit}
                      project={selectedProject}
                      onClose={this.showHideCreateBudge}/>

        <BudgetStatistics onClose={() => this.showHideBudgetStatistics(false)}
                          budget={budgetForStatistics}
                          open={showBudgetStatisticsModal}/>

      </div>
    );
  }
}

export default connect(state => ({
  budgets: state.project.budgets,
  transactions: state.project.transactions,
  categories: state.project.categories,
  customers: state.project.customers,
  users: state.dashboard.users,
  selectedProject: state.project.selectedProject,
}), {})(Budgets);
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
import {BudgetType} from '@model/budget'

class Budgets extends Component {

  static propTypes = {
    budgets: PropTypes.arrayOf(BudgetType)
  };

  state = {
    expanded: null,
    showCreateBudgetModal: false,
    showBudgetStatisticsModal:false,
    budgetForEdit: {},
    budgetForStatistics: {},
  };

  handleExpandPanelChange = (budgetId) => {

    this.setState({expanded: budgetId})
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

    const {budgets, selectedProject} = this.props;
    const {expanded, budgetForEdit, budgetForStatistics, showCreateBudgetModal, showBudgetStatisticsModal} = this.state;

    const hasBudgets = budgets.length > 0;

    return (
      <div className={'budgets-container'}>

        <PageTitle text={'Budgets'} icon={'budgets'}/>

        <Breadcrumb item={{id: 'budgetsCrumb', value: 'Budgets', path: '/dashboard'}}/>

        <div className={'px-2 py-3'}>
        {
          budgets.map(budget => <BudgetPanel key={budget.id}
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
  selectedProject: state.project.selectedProject,
}), {})(Budgets);
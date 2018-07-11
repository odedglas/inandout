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
import {BudgetType} from '@model/budget'
import {editBudget} from "../../../../actions/project";

class Budgets extends Component {

  static propTypes = {
    budgets: PropTypes.arrayOf(BudgetType)
  };

  state = {
    expanded: null,
    showCreateBudgetModal: false,
    budgetForEdit: {},
  };

  handleExpandPanelChange = (budgetId) => {

    this.setState({expanded: budgetId})
  };

  showHideCreateBudge = (show, budget) => {

    this.setState({
      showCreateBudgetModal: !!show,
      budgetForEdit: budget || {}
    })

  };

  render() {

    const {budgets, selectedProject} = this.props;
    const {expanded, budgetForEdit, showCreateBudgetModal} = this.state;

    const hasBudgets = budgets.length > 0;

    return (
      <div className={'budgets-container'}>

        <PageTitle text={'Budgets'} icon={'budgets'}/>

        <Breadcrumb item={{id: 'budgetsCrumb', value: 'Budgets', path: '/dashboard'}}/>

        <div className={'px-4 py-3'}>
        {
          budgets.map(budget => <BudgetPanel key={budget.id}
                                             onExpandChange={this.handleExpandPanelChange}
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
                <Button size="small" color="primary">
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

      </div>
    );
  }
}

export default connect(state => ({
  budgets: state.project.budgets,
  selectedProject: state.project.selectedProject,
}), {})(Budgets);
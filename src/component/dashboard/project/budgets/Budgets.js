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
import {createTransaction} from "@action/project";
import CreateBudget from '@modal/CreateBudget'
import CreateTransaction from '@modal/CreateTransaction'
import BudgetStatistics from '@modal/BudgetStatistics'
import {ProjectContext} from '../ProjectContext';

class Budgets extends Component {

  static propTypes = {
    createTransaction: PropTypes.func.isRequired,
  };

  state = {
    expanded: null,
    showCreateBudgetModal: false,
    showBudgetStatisticsModal: false,
    showTransactionModal: false,
    transactionInitialState: {},
    budgetForEdit: {},
    budgetForStatistics: {},
    filledBudgets: [],
    expandStateChange: false,
  };

  handleExpandPanelChange = (budgetId) => {

    this.setState({expanded: budgetId, expandStateChange: budgetId !== this.state.expanded})
  };

  showHideCreateBudge = (show, budget) => {

    if (show) {
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

    if (show) {
      this.setState({
        showBudgetStatisticsModal: true,
        budgetForStatistics: budget || {}
      });
    }
    else {

      this.setState({showBudgetStatisticsModal: false});
    }
  };

  showHideCreateTransaction = (show, budget) => {

    if (show) {
      this.setState({
        showTransactionModal: true,
        transactionInitialState: {
          date: new Date(),
          category: budget.categories[0].id
        }
      })
    }
    else {
      this.setState({showTransactionModal: false})
    }
  };

  handleCreateTransaction = (transaction, action, cb, project) => {

    if (action === 'add') {

      this.props.createTransaction(
        project,
        transaction,
        cb
      )
    }
  };

  render() {

    const {
      expanded,
      budgetForEdit,
      budgetForStatistics,
      showCreateBudgetModal,
      showBudgetStatisticsModal,
      showTransactionModal,
      transactionInitialState
    } = this.state;

    return (
      <ProjectContext.Consumer>
        {(projectContext) => {

          const budgets = projectContext.budgets;
          const hasBudgets = budgets.length > 0;
          const project = projectContext.project;

          return (
            <div className={'budgets-container'}>

              <PageTitle text={'Budgets'} icon={'budgets'}/>

              <Breadcrumb item={{id: 'budgetsCrumb', value: 'Budgets'}}/>

              <div className={'px-2 py-3'}>
                {
                  budgets.map(budget => <BudgetPanel key={budget.id}
                                                     project={project}
                                                     onExpandChange={this.handleExpandPanelChange}
                                                     editBudget={(budget) => this.showHideCreateBudge(true, budget)}
                                                     showCreateTransaction={(budget) => this.showHideCreateTransaction(
                                                       true, budget)}
                                                     showBudgetStatistics={(budget) => this.showHideBudgetStatistics(
                                                       true, budget)}
                                                     expanded={expanded === budget.id}
                                                     budget={budget}/>)
                }
              </div>

              {
                !hasBudgets ?
                  <div className={'row'}>
                    <div className={'col-sm-12 flex-center empty-budgets'}>
                      <img className={'icon'} src={require('@img/cactus.svg')} alt="no-budgets"/>
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

              <Tooltip title={'Create Budget'} placement={'top'}>
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
                            project={project}
                            onClose={this.showHideCreateBudge}/>

              <CreateTransaction open={showTransactionModal}
                                 transaction={{}}
                                 createInitialState={transactionInitialState}
                                 transactionCrudHandler={(transaction, action, cb) => this.handleCreateTransaction(transaction, action, cb, project)}
                                 onClose={this.showHideCreateTransaction}/>

              <BudgetStatistics onClose={() => this.showHideBudgetStatistics(false)}
                                budget={budgetForStatistics}
                                open={showBudgetStatisticsModal}/>

            </div>
          );
        }}
      </ProjectContext.Consumer>
    );
  }
}

export default connect(null, {createTransaction})(Budgets);
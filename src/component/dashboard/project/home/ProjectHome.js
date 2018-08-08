import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import SnackbarNotification from '@common/SnackbarNotification';
import HomeCreateDial from './HomeCreateDial';
import Breadcrumb from '../breadcrumbs/Breadcrumb';
import ProjectKpiCard from './kpi/ProjectKpiCard';
import TransactionsBalanceKpi from './kpi/TransactionsBalanceKpi';
import BudgetsUsageKpi from './kpi/BudgetsUsageKpi';
import ProjectBalanceKpi from './kpi/ProjectBalanceKpi';
import {TransactionType} from "@model/transaction";
import {BudgetType} from "@model/budget";

import projectService from '@service/project';

import dateUtil from '@util/date';

const formatShort = date => dateUtil.format(date, 'MMM YY');
const formatLong = date => dateUtil.format(date, 'MMM YYYY');

class ProjectHome extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    transactions: PropTypes.arrayOf(TransactionType),
    budgets: PropTypes.arrayOf(BudgetType)
  };

  state = {
    showSuccessSnackbar: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
    selectedDate: new Date(),
  };

  showHideProjectActionMenu = show => {

  };

  hideSnackbar() {

    this.setState({showSuccessSnackbar: false})
  }

  showSnackbar(text, variant = 'success') {

    this.setState({
      showSuccessSnackbar: true,
      snackbarMessage: text,
      snackbarVariant: variant
    })
  }

  render() {

    const {selectedProject, transactions, budgets} = this.props;
    const {showSuccessSnackbar, snackbarMessage, snackbarVariant, selectedDate} = this.state;

    const currency = selectedProject.currency;
    const indicators = projectService.calculateProjectIndicators(
      selectedProject,
      transactions,
      budgets
    );

    console.log("Home indicator is : ", indicators);


    return (
      <div className={'project-home-wrapper row'}>

        <Breadcrumb item={{id: 'projectHomeCrumb', value: formatLong(selectedDate)}}/>

        <div className={'col-sm-12 px-0 row'}>

          <div className={'col-sm-12 col-md-6'}>
            <ProjectKpiCard title={'Monthly Balance'}
                            body={<TransactionsBalanceKpi currency={currency}
                                                          {...indicators.monthlyBalance}/>}
                            badgeText={formatShort(selectedDate)}>
            </ProjectKpiCard>
          </div>

          <div className={'col-sm-6 mt-sm-3 col-md-3 mt-md-0'}>
            <ProjectKpiCard title={'Budgets usage'}
                            body={<BudgetsUsageKpi currency={currency}
                                                   {...indicators.budgetsUsage}/>}
                            badgeText={formatShort(selectedDate)}>
            </ProjectKpiCard>
          </div>

          <div className={'col-sm-6 mt-sm-3 col-md-3 mt-md-0'}>
            <ProjectKpiCard title={'Project Balance'}
                            badgeText={'Overall'}
                            body={<ProjectBalanceKpi currency={currency}
                                                     created={formatShort(selectedProject.created)}
                                                     selectedDate={formatShort(selectedDate)}
                                                     balance={indicators.totalBalance}/>}>

            </ProjectKpiCard>
          </div>

        </div>

        <HomeCreateDial showNotification={(message, variant) => this.showSnackbar(message, variant)}/>

        <SnackbarNotification onClose={() => this.hideSnackbar()}
                              anchor={{
                                vertical: 'top',
                                horizontal: 'right',
                              }}
                              open={showSuccessSnackbar}
                              duration={2500}
                              variant={snackbarVariant}
                              message={snackbarMessage}>
        </SnackbarNotification>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedProject: state.project.selectedProject,
    transactions: state.project.transactions,
    budgets: state.project.budgets,
  }), {})
)(ProjectHome);

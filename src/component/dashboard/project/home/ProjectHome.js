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
import TransactionsBalance from './kpi/TransactionsBalance';
import {TransactionType} from "@model/transaction";
import {BudgetType} from "@model/budget";

import projectService from '@service/project';
import util from '@util/';
import dateUtil from '@util/date';



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
    const selectedDateLongFormat = dateUtil.format(selectedDate, 'MMM YYYY');
    const selectedDateShortFormat = dateUtil.format(selectedDate, 'MMM YY');

    return (
      <div className={'project-home-wrapper row'}>

        <Breadcrumb item={{id: 'projectHomeCrumb', value: selectedDateLongFormat}}/>

        <div className={'col-sm-12 px-0 row'}>

          <div className={'col-sm-12 col-md-6'}>
            <ProjectKpiCard title={'Transactions Balance'}
                            body={<TransactionsBalance currency={currency}
                                                       {...indicators.monthlyBalance}/>}
                            badgeText={selectedDateShortFormat}>
            </ProjectKpiCard>
          </div>

          <div className={'col-sm-6 mt-sm-3 col-md-3 mt-md-0'}>
            <ProjectKpiCard title={'Budget usage'}
                            body={<span>Card Body</span>}
                            badgeText={selectedDateShortFormat}>
            </ProjectKpiCard>
          </div>

          <div className={'col-sm-6 mt-sm-3 col-md-3 mt-md-0'}>
            <ProjectKpiCard title={'Project Balance'}
                            body={<span>Card Body</span>}>

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

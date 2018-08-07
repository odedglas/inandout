import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import Breadcrumb from '../breadcrumbs/Breadcrumb';
import Paper from '@material-ui/core/Paper';

import SnackbarNotification from '@common/SnackbarNotification';
import HomeCreateDial from './HomeCreateDial';
import projectService from '@service/project';
import dateUtil from '@util/date';
import {TransactionType} from "@model/transaction";
import {BudgetType} from "@model/budget";

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
    const {showSuccessSnackbar, snackbarMessage, snackbarVariant} = this.state;

    const today = new Date();

    const indicators = projectService.calculateProjectIndicators(
      selectedProject,
      transactions,
      budgets
    );

    return (
      <div className={'project-home-wrapper row'}>

        <Breadcrumb item={{id: 'projectHomeCrumb', value: dateUtil.format(today, 'MMM YYYY')}}/>

        <div className={'col-sm-12 px-0 row'}>

          <div className={'col-sm-6'}>
            <Paper className={'project-kpi'}>
              Monthly Balance indicator
            </Paper>
          </div>

          <div className={'col-sm-3'}>
            <Paper className={'project-kpi'}>
              Budget usage
            </Paper>
          </div>

          <div className={'col-sm-3'}>
            <Paper className={'project-kpi'}>
              Project Balance
            </Paper>
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

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
import ProjectKpi from './kpi/ProjectKpi';
import ProjectCharts from './charts/ProjectCharts';
import ProjectTransactions from './ProjectTransactions';
import ProjectEvents from './ProjectEvents';
import {TransactionType} from "@model/transaction";
import {BudgetType} from "@model/budget";
import {CategoryType} from "@model/category";
import Paper from '@material-ui/core/Paper';
import projectService from '@service/project';
import dateUtil from '@util/date';

const formatLong = date => dateUtil.format(date, 'MMM YYYY');

class ProjectHome extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    transactions: PropTypes.arrayOf(TransactionType),
    budgets: PropTypes.arrayOf(BudgetType),
    categories: PropTypes.arrayOf(CategoryType)
  };

  state = {
    showSuccessSnackbar: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
    selectedDate: new Date(),
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

    const {selectedProject, transactions, budgets, categories} = this.props;
    const {showSuccessSnackbar, snackbarMessage, snackbarVariant, selectedDate} = this.state;

    const indicators = projectService.calculateProjectIndicators(
      selectedProject,
      transactions,
      budgets
    );

    return (
      <div className={'project-home-wrapper row'}>

        <Breadcrumb item={{id: 'projectHomeCrumb', value: formatLong(selectedDate)}}/>

        <ProjectKpi indicators={indicators}
                    selectedProject={selectedProject}
                    selectedDate={selectedDate} />

        <ProjectCharts selectedProject={selectedProject}
                       transactions={transactions}
                       categories={categories}/>

        <div className={'col-sm-12 px-0 mb-4 row'}>
          <div className={'col-sm-12 col-md-6'}>
            <Paper className={'project-latest-transactions p-3 row'}>

              <div className={'col-sm-12 px-0 title mb-3'}>
                <ProjectTransactions transactions={transactions} />
              </div>

            </Paper>
          </div>

          <div className={'col-sm-12 col-md-6 mt-sm-3 mt-md-0'}>
            <Paper className={'project-events p-3 row'}>

              <div className={'col-sm-12 px-0 title mb-3'}>
               <ProjectEvents/>
              </div>

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
    categories: state.project.categories,
    transactions: state.project.transactions,
    budgets: state.project.budgets,
  }), {})
)(ProjectHome);

import React from 'react';
import PropTypes from 'prop-types'
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
import Paper from '@material-ui/core/Paper';
import ProjectToolbar from './ProjectToolbar';
import projectService from '@service/project';
import dateUtil from '@util/date';
import {ProjectContext} from '../ProjectContext';
import {ProjectType} from "@model/project";
import {TransactionType} from "@model/transaction";
import {BudgetType} from "@model/budget";
import {CategoryType} from "@model/category";

class ProjectHome extends React.Component {

  static propTypes = {
    project: PropTypes.oneOfType([
      PropTypes.object,
      ProjectType
    ]),
    transactions: PropTypes.arrayOf(TransactionType),
    budgets: PropTypes.arrayOf(BudgetType),
    categories: PropTypes.arrayOf(CategoryType),
    selectedDate: PropTypes.object.isRequired,
  };

  state = {
    showSuccessSnackbar: false,
    snackbarMessage: '',
    snackbarVariant: 'success',
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

    const { selectedDate } = this.props;
    const {showSuccessSnackbar, snackbarMessage, snackbarVariant} = this.state;

    return (
      <ProjectContext.Consumer>
        {(projectContext) => {

          const {project, transactions, budgets, categories, events} = projectContext;

          const indicators = projectService.calculateProjectIndicators(
            project,
            transactions,
            budgets,
            selectedDate
          );

          return (
            <div className={'project-home-wrapper row'}>

              <Breadcrumb item={{id: 'projectHomeCrumb', value: dateUtil.formantMothYearLong(selectedDate)}}/>

              <ProjectToolbar selectedDate={selectedDate}/>

              <ProjectKpi indicators={indicators}
                          project={project}
                          selectedDate={selectedDate}/>

              <ProjectCharts transactions={transactions}
                             categories={categories}/>

              <div className={'col-sm-12 px-0 mb-4 row'}>
                <div className={'col-sm-12 col-md-6'}>
                  <Paper className={'p-0 row'}>

                    <div className={'col-sm-12 px-0'}>
                      <ProjectEvents events={events}/>
                    </div>

                  </Paper>
                </div>

                <div className={'col-sm-12 col-md-6 mt-sm-3 mt-md-0'}>
                  <Paper className={'p-0 row'}>

                    <div className={'col-sm-12 px-0'}>
                      <ProjectTransactions transactions={transactions}/>
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
        }}
      </ProjectContext.Consumer>
    )
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedDate: state.project.selectedDate,
  }), {})
)(ProjectHome);

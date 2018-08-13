import React from 'react';
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
import projectService from '@service/project';
import dateUtil from '@util/date';

import {ProjectContext} from '../ProjectContext';

const formatLong = date => dateUtil.format(date, 'MMM YYYY');

class ProjectHome extends React.Component {

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

    const {showSuccessSnackbar, snackbarMessage, snackbarVariant, selectedDate} = this.state;

    return (
      <ProjectContext.Consumer>
        {(projectContext) => {

          const indicators = projectService.calculateProjectIndicators(
            projectContext.project,
            projectContext.transactions,
            projectContext.budgets
          );

          return (
            <div className={'project-home-wrapper row'}>

              <Breadcrumb item={{id: 'projectHomeCrumb', value: formatLong(selectedDate)}}/>

              <ProjectKpi indicators={indicators}
                          project={projectContext.project}
                          selectedDate={selectedDate} />

              <ProjectCharts transactions={projectContext.transactions}
                             categories={projectContext.categories}/>

              <div className={'col-sm-12 px-0 mb-4 row'}>
                <div className={'col-sm-12 col-md-6'}>
                  <Paper className={'project-latest-transactions p-3 row'}>

                    <div className={'col-sm-12 px-0 title mb-3'}>
                      <ProjectTransactions transactions={projectContext.transactions.filter(t => !t.income)} />
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
          )
        }}
      </ProjectContext.Consumer>
    );
  }
}

export default compose(
  withRouter,
  connect(null, {})
)(ProjectHome);

import React from 'react';
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import SnackbarNotification from '@common/SnackbarNotification';
import HomeCreateDial from '../../dashboard/project/home/HomeCreateDial';
import projectService from '@service/project';
import {ProjectContext} from '../../dashboard/project/ProjectContext';
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

    const {selectedDate} = this.props;
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
            <div className={'mobile-home-wrapper row'}>

              <div> {project.id} </div>

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

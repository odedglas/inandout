import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import IconButton from '@material-ui/core/IconButton';
import Breadcrumb from '../breadcrumbs/Breadcrumb';
import Paper from '@material-ui/core/Paper';
import DynamicIcon from '@common/DynamicIcon'

import projectService from '@service/project';
import dateUtil from '@util/date';
import {TransactionType} from "@model/transaction";
import {BudgetType} from "@model/budget";

import firebaseService from '@service/firebase';

class ProjectHome extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    transactions: PropTypes.arrayOf(TransactionType),
    budgets: PropTypes.arrayOf(BudgetType)
  };

  showHideProjectActionMenu = show => {
/*    this.setState({
      showActionMenu: show
    })*/

    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be whitelisted in the Firebase Console.
      url: 'https://inandout-91d34.firebaseapp.com/signup',
      // This must be true.
      handleCodeInApp: true
    };


    firebaseService.auth.sendSignInLinkToEmail("anonymouse.work.it@gmail.com", actionCodeSettings)
      .then(function() {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        debugger;
      })
      .catch(function(error) {
        // Some error occurred, you can inspect the code: error.code
        debugger;
      });

    if (firebaseService.auth.isSignInWithEmailLink(window.location.href)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      debugger;
      firebaseService.auth.signInWithEmailLink("anonymouse.work.it@gmail.com", window.location.href)
        .then(function(result) {
          // Clear email from storage.
          debugger;
          window.localStorage.removeItem('emailForSignIn');
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch(function(error) {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  };

  render() {

    const {selectedProject, transactions, budgets} = this.props;
    const today = new Date();

    const indicators = projectService.calculateProjectIndicators(
      selectedProject,
      transactions,
      budgets
    );

    console.log(indicators);

    return (
      <div className={'project-home-wrapper row'}>

        <Breadcrumb item={{id:'projectHomeCrumb' ,value:dateUtil.format(today,'MMM YYYY')}}/>

        <div className={'col-sm-12 px-0 row project-actions'}>

          <div className={'col-sm-6'}> Date navigation </div>
          <div className={'col-sm-6'}>
            <IconButton className={'actions-menu'} onClick={this.showHideProjectActionMenu}>
              <DynamicIcon name={'actionMenu'}/>
            </IconButton>
          </div>
        </div>

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

        I R Home! for { selectedProject.name }
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

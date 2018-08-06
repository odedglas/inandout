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

import request from '@util/request';
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
debugger;

    request.post('sendInviteMail',{email: 'anonymouse.work.it@gmail.com', title: 'Wassaps'}).then(res => {
      debugger;
    })

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

import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import PageTitle from "@common/PageTitle";
import Breadcrumb from '../breadcrumbs/Breadcrumb';
import Paper from '@material-ui/core/Paper';
import Calendar from './Calendar';

class ProjectCalendar extends Component {

  static propTypes = {
    selectedProject: PropTypes.any
  };

  render() {
    const {selectedProject} = this.props;

    return (
      <div className={'calendar-container'}>

        <PageTitle text={'Calendar'} icon={'calendar'}/>

        <Breadcrumb item={{id: 'calendarsCrumb', value: 'Calendar', path: '/dashboard'}}/>

        <Paper className={'mx-3 mt-3 p-3'}>
          <Calendar />
        </Paper>
      </div>

    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {})(ProjectCalendar);
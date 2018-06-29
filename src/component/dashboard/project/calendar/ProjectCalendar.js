import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';

import Breadcrumb from '../breadcrumbs/Breadcrumb';

class ProjectCalendar extends Component {

  static propTypes = {
    selectedProject: PropTypes.any
  };

  render() {
    const { selectedProject } = this.props;

    return (
      <div className={'welcome-container'}>
        <Breadcrumb item={{id:'calendarsCrumb' ,value:'Calendar', path:'/dashboard'}}/>

        I R Calendar for { selectedProject.name }
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {})(ProjectCalendar);
import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import Breadcrumb from '../breadcrumbs/Breadcrumb';

import dateUtil from '@util/date';

class ProjectHome extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object,
  };

  render() {

    const {selectedProject} = this.props;
    const today = new Date();

    return (
      <div className={'project-home-wrapper'}>

        <Breadcrumb item={{id:'projectHomeCrumb' ,value:dateUtil.format(today,'MMMM YYYY')}}/>

        <div className={'col-sm-4'}> 1</div>
        <div className={'col-sm-4'}>2</div>
        <div className={'col-sm-4'}> 3</div>
        I R Home! for { selectedProject.name }
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedProject: state.project.selectedProject,
  }), {})
)(ProjectHome);

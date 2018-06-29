import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

class ProjectHome extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object,
  };

  render() {

    const {selectedProject} = this.props;

    return (
      <div className={'welcome-container'}>

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

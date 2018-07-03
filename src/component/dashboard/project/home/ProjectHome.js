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
      <div className={'row'}>
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

import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import CircularProgress from '@material-ui/core/CircularProgress';

import { selectProject } from "@action/project";

import { PROJECT_TYPES } from '@const/';
import projectService from '@service/project';


class ProjectHome extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object
  };

  state = {
    loadedProject: {},
    loading: false,
  };

  componentWillMount() {

    const { selectedProject, match } = this.props;

    if(!selectedProject) {

      this.setState({ loading: true });
      projectService.fetchProject(match.params.identifier).then(project => {

        this.props.selectProject(project);
        this.setState({ loadedProject: project, loading: false})
      });
    }
  }

  render() {

    const { selectedProject } = this.props;
    const { loadedProject, loading } = this.state;

    const _project = selectedProject || loadedProject;
    return (
      <div className={'scrollable'}>
        { loading ? <CircularProgress size={50}/> : null}
        I R PROJECT HOME DUDE!!!
        Display for KEY -> { _project.id }

      </div>
    );
  }
}

export default compose(
  withRouter,
  connect( state => ({
    selectedProject: state.project.selectedProject,
  }), {selectProject})
)(ProjectHome);

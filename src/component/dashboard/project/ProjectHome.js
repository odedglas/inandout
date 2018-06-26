import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';

import { PROJECT_TYPES } from '@const/';
import util from '@util/';
import projectService from '@service/project';


class ProjectHome extends React.Component {

  static propTypes = {
    project: PropTypes.object
  };

  state = {
    loadedProject: {},
    loading: false,
  };

  componentWillMount() {

    const { project, match } = this.props;

    if(!project) {

      this.setState({ loading: true });
      projectService.fetchProject(match.params.identifier).then(project => {
        debugger;
        this.setState({ loadedProject: project, loading: false})
      });
    }
  }

  render() {

    const { project } = this.props;
    const { loadedProject, loading } = this.state;

    const _project = project || loadedProject;
    return (
      <div>
        { loading ? <CircularProgress size={50}/> : null}
        I R PROJECT HOME DUDE!!!
        Display for KEY -> { _project.id }
      </div>
    );
  }
}

export default withRouter(ProjectHome);

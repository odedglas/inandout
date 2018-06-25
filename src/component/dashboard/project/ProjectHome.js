import React from 'react';
import PropTypes from 'prop-types';

import { PROJECT_TYPES } from '@const/';
import util from '@util/';
import projectService from '@service/project';


class ProjectHome extends React.Component {

  static propTypes = {
    project: PropTypes.object
  };

  state = {
    loadedProject: {}
  };

  componentWillMount() {

    //TODO -> Should support project fetch for deep link by project name ******
    const project = this.props.project;
    if(!project) {
      console.log("loading without preload should fetch!")
      this.setState({ loadedProject: {id: 'no key loaded' }})
    }
  }

  render() {

    const { project } = this.props;
    const { loadedProject } = this.state;

    const _project = project || loadedProject;
    return (
      <div>
        I R PROJECT HOME DUDE!!!
        Display for KEY -> { _project.id }
      </div>
    );
  }
}

export default ProjectHome;

import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import CircularProgress from '@material-ui/core/CircularProgress';
import ProjectBreadcrumb from './breadcrumbs/ProjectBreadcrumb';

import Breadcrumbs from './breadcrumbs/Breadcrumbs';
import Breadcrumb from './breadcrumbs/Breadcrumb';
import {selectProject} from "@action/project";
import projectService from '@service/project';
import util from '@util/';
import {getProjectRoutes} from './ProjectRoutes';


class ProjectHome extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object
  };

  state = {
    loading: false,
  };

  componentDidMount() {

    const {selectedProject, match} = this.props;

    if (util.isEmptyObject(selectedProject)) {

      this.setState({loading: true});
      projectService.fetchProject(match.params.identifier).then(project => {

        this.props.selectProject(project);
        this.setState({loading: false})
      });
    }
  }

  render() {

    const {selectedProject} = this.props;
    const {loading} = this.state;

    return (
      <div className={'project-home'}>

        <Breadcrumbs project={selectedProject}/>

        <Breadcrumb item={{
          id: 'projectCrumb',
          render: (val) => <ProjectBreadcrumb selectedProjectId={val}/>,
          value: selectedProject.id,
          path: '/dashboard'
        }}
        />

        <div className={'content scrollable'}>

          {loading ? <CircularProgress size={50}/> : null}
          I R PROJECT HOME DUDE!!!
          Display for KEY -> {selectedProject.id}

          {getProjectRoutes()}

        </div>

      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedProject: state.project.selectedProject,
  }), {selectProject})
)(ProjectHome);

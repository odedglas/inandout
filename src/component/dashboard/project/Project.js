import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import CircularProgress from '@material-ui/core/CircularProgress';

import Breadcrumbs from './breadcrumbs/Breadcrumbs';
import Breadcrumb from './breadcrumbs/Breadcrumb';
import ProjectBreadcrumb from './breadcrumbs/ProjectBreadcrumb';

import {fetchProject} from "@action/project";
import util from '@util/';
import {getProjectRoutes} from './ProjectRoutes';

class Project extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    fetchProject: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
  };

  componentDidMount() {

    const {selectedProject, fetchProject, match} = this.props;

    //Fetching project if none was selected.
    if (util.isEmptyObject(selectedProject)) {
      console.log("No selected project, Fetching ->" + match.params.identifier);
      fetchProject(match.params.identifier);
    }
  }

  render() {

    const {selectedProject, loading, location} = this.props;

    return (
      <div className={'project-container'}>

        <Breadcrumbs project={selectedProject}/>

        <Breadcrumb item={{
          id: 'projectCrumb',
          render: (val) => <ProjectBreadcrumb selectedProjectId={val}/>,
          value: selectedProject.id,
          path: '/dashboard'
        }}
        />

        <div className={'content scrollable'}>
          <div className="flex-center">
            {
              loading ? <CircularProgress size={50}/> : getProjectRoutes(location)
            }
          </div>
        </div>

      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedProject: state.project.selectedProject,
    loading: state.project.loadingProject,
  }), {fetchProject})
)(Project);

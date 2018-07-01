import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import { CSSTransition } from 'react-transition-group';

import CircularProgress from '@material-ui/core/CircularProgress';

import Breadcrumbs from './breadcrumbs/Breadcrumbs';
import Breadcrumb from './breadcrumbs/Breadcrumb';
import ProjectBreadcrumb from './breadcrumbs/ProjectBreadcrumb';

import {setPreSelectedProject} from "@action/project";
import util from '@util/';
import {getProjectRoutes} from './ProjectRoutes';

class Project extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    setPreSelectedProject: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired
  };

  componentDidMount() {

    const {selectedProject, match} = this.props;

    //Setting preselected if none exists
    if (util.isEmptyObject(selectedProject)) {
      this.props.setPreSelectedProject(match.params.identifier)
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
          <div className="flex-center" style={{position: 'absolute'}}>
            <CSSTransition
              in={loading}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <CircularProgress size={50}/>
            </CSSTransition>
          </div>
          {
            !loading ? getProjectRoutes(location) : null
          }
        </div>

      </div>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedProject: state.project.selectedProject,
    loading: state.dashboard.loading,
  }), {setPreSelectedProject})
)(Project);

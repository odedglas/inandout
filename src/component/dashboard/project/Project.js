import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {CSSTransition} from 'react-transition-group';

import CircularProgress from '@material-ui/core/CircularProgress';

import Breadcrumbs from './breadcrumbs/Breadcrumbs';
import Breadcrumb from './breadcrumbs/Breadcrumb';
import ProjectsMenu from '@common/ProjectsMenu';
import ProjectProvider from './ProjectContext';

import {setPreSelectedProject, updateCachedProject, createProjectSyncListener} from "@action/project";
import util from '@util/';
import {getProjectRoutes} from './ProjectRoutes';
import {loadTransactions} from "@action/project";

class Project extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    loadTransactions: PropTypes.func.isRequired,
    selectedDate: PropTypes.object,
    setPreSelectedProject: PropTypes.func.isRequired,
    updateCachedProject: PropTypes.func.isRequired,
    createProjectSyncListener: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
  };

  componentDidMount() {

    const {selectedProject, selectedDate,  match, createProjectSyncListener} = this.props;

    //Setting preselected if none exists
    if (util.isEmptyObject(selectedProject)) {
      this.props.setPreSelectedProject(match.params.identifier)
    }
    else {
      //Else, Creating sync listener
      createProjectSyncListener(selectedProject.id, selectedDate);
    }
  }

  componentWillUnmount() {

    this.props.updateCachedProject();
  }

  componentDidUpdate(prevProps) {

    const {selectedProject, selectedDate, createProjectSyncListener} = this.props;

    if (selectedProject.id !== prevProps.selectedProject.id) {
      createProjectSyncListener(selectedProject.id, selectedDate);
    }
  }

  render() {

    const {selectedProject, loading, location} = this.props;
    console.log("Project Render")
    return (
      <ProjectProvider>
        <div className={'project-container'}>

          <Breadcrumbs project={selectedProject}/>

          <Breadcrumb item={{
            id: 'projectCrumb',
            render: (val) => <ProjectsMenu selectedProjectId={val}/>,
            value: selectedProject.id,
            path: '/dashboard'
          }}
          />

          <div className={'content scrollable'}>
            <div className="flex-center project-loader" style={{position: 'absolute'}}>
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
              !loading ?               <CSSTransition
                in={!loading}
                timeout={300}
                classNames="fade"
                unmountOnExit
              >
                  {getProjectRoutes(location)}
              </CSSTransition>
                 : null
            }
          </div>

        </div>
      </ProjectProvider>
    );
  }
}

export default compose(
  withRouter,
  connect(state => ({
    selectedProject: state.project.selectedProject,
    selectedDate: state.project.selectedDate,
    loading: state.dashboard.loading,
  }), {setPreSelectedProject, updateCachedProject, createProjectSyncListener, loadTransactions})
)(Project);

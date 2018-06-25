import React from 'react';
import {connect} from 'react-redux';

import CreateProjectModal from '../modals/CreateProject'
import ProjectCard from './ProjectCard';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

import projectsService from '@service/project'
import firebaseService from '@service/firebase'
import { setLoading } from "@action/loading";

class Landing extends React.Component {

  state = {
    projects              : [],
    showCreateProjectModal: false,
    fetchingProjects: true,
  };

  componentWillMount() {
    const userProjectMeta = firebaseService.user.projects;

    if(userProjectMeta.length > 0) {

      projectsService.fetchCurrentUserProjects().then(projects => {
        this.setState({ projects, fetchingProjects: false});
      })
    }
    else {
      this.setState({ fetchingProjects: false });
    }
  }

  showCreateProjectModal = () => {
    this.setState({showCreateProjectModal: true});
  };

  closeCreateProjectModal = () => {
    this.setState({showCreateProjectModal: false})
  };

  render() {

    const {projects, showCreateProjectModal, fetchingProjects} = this.state;

    const hasProjects = projects.length > 0;
    const shouldShowAddProjectHelper = !fetchingProjects && !hasProjects;

    return (
      <div className={'lading-page'}>
        <div className={'landing-header'}>
          <div className={'centered'}>
            <div className={'landing-text'}>
              <h1> Welcome to In&Out !</h1>
              <span>Create a project and start managing your income / outcome.</span>
              <br/>
              <span>Stay in control.</span>
            </div>
          </div>
        </div>
        <div className={'projects-container'}>
          <div className={'centered'}>

            {fetchingProjects ? <CircularProgress size={50}/> : null}

            {hasProjects ? <div className={'title'}> Your Projects </div>  : null}

            {shouldShowAddProjectHelper ? <Button color="primary" onClick={this.showCreateProjectModal}>
              &#43; Add Project
            </Button> : null
            }

            <div className={'projects-inner'}>
              {
                projects.map(project => <ProjectCard onProjectClick={this.gotoProject} key={project.id} project={project}/>)
              }
            </div>
          </div>
        </div>
        <CreateProjectModal open={showCreateProjectModal}
                            onClose={this.closeCreateProjectModal}/>
        <Tooltip title={'Add Project'} placement={'top'}>
          <Button variant="fab"
                  color="primary"
                  aria-label="add"
                  onClick={this.showCreateProjectModal}
                  className={'add-project'}>
            <AddIcon/>
          </Button>
        </Tooltip>
      </div>
    );
  }
}

export default connect( null, {setLoading})(Landing);
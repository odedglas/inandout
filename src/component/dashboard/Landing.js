import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import CreateProjectModal from '../modals/CreateProject'
import ProjectCard from './ProjectCard';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';

import { selectProject } from "@action/project";

class Landing extends React.Component {


  static propTypes = {
    projects: PropTypes.array,
    fetchingProjects: PropTypes.bool.isRequired,
    selectProject: PropTypes.func.isRequired,
  };

  state = {
    showCreateProjectModal: false,
  };

  showCreateProjectModal = () => {
    this.setState({showCreateProjectModal: true});
  };

  closeCreateProjectModal = () => {
    this.setState({showCreateProjectModal: false})
  };

  gotoProject = project => {

    const identifier = project.identifier;
    this.props.selectProject(project);

    this.props.history.push({
      pathname: '/dashboard/project/' + identifier,
    });

  };

  render() {

    const { showCreateProjectModal } = this.state;
    const {projects, fetchingProjects} = this.props;

    const hasProjects = projects.length > 0;
    const shouldShowAddProjectHelper = !fetchingProjects && !hasProjects;

    return (
      <div className={'lading-page scrollable'}>
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

            {shouldShowAddProjectHelper ? <div className={'no-projects'}>
                <div>You have no existing projects, It's all starts here:</div>
                <Button color="primary" onClick={this.showCreateProjectModal}>
                  &#43; Add Project
                </Button>
              </div>
              : null
            }

            <div className={'projects-inner'}>
              {
                projects.map(project => <ProjectCard onProjectClick={this.gotoProject}
                                                     key={project.id}
                                                     showAnimation={fetchingProjects}
                                                     project={project}/>)
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

export default compose(
  withRouter,
  connect( state => ({
    projects: state.project.projects,
    fetchingProjects: state.project.fetchingProjects,
  }), {selectProject})
)(Landing);

import React from 'react';

import CreateProjectModal from '../modals/CreateProject'
import ProjectCard from './ProjectCard';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

class Landing extends React.Component {

  state = {
    projects: [
      {name: 'Project 1', id:'123asda12'},
      {name: 'Project 2', id:'123a2132'},
      {name: 'Project 3', id:'123123da12'},
    ],
    showCreateProjectModal: false,
  };

  showCreateProjectModal = () => {
    console.log("Creating project");
    this.setState({showCreateProjectModal: true})
  };

  closeCreateProjectModal = () => {
    this.setState({showCreateProjectModal: false})
  };

  render () {

    const { projects, showCreateProjectModal } = this.state;

    const landingHeaderBackground = {
      'backgroundImage': `url('${require('@img/dashboard-header.jpg')}')`,
    };

    return (
      <div className={'lading-page h-100'}  style={landingHeaderBackground}>
        <div className={'landing-header'}>
          <div className={'landing-text'}>
            <h2> Welcome to In&Out !</h2>
            <span>Create a project and start managing your income / outcome.</span>
            <br/>
            <span>Stay in control.</span>
          </div>
          <div className={'triangle'}>
          </div>
        </div>
        <div className={'projects-container'}>
          {projects.length > 0 ? <div className={'title'}> Projects goes here </div> : null}
          <div className={'projects-inner'}>
            {
              projects.map( project => <ProjectCard key={project.id} project={project}/>)
            }
          </div>
          <Button variant="fab"
                  color="primary"
                  aria-label="add"
                  onClick={this.showCreateProjectModal}
                  className={'add-project'}>
            <AddIcon />
          </Button>
        </div>
        <CreateProjectModal open={showCreateProjectModal} onClose={this.closeCreateProjectModal}/>
      </div>
    );
  }
}

export default Landing;

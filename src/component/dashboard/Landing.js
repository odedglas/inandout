import React from 'react';
import ReactDOM from 'react-dom';

import CreateProjectModal from '../modals/CreateProject'
import ProjectCard from './ProjectCard';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';

class Landing extends React.Component {

  state = {
    projects              : [
      {name: 'Project 1', id: '123asda12'},
      {name: 'Project 2', id: '123a2132'},
      {name: 'Project 3', id: '123123da12'},
      {name: 'Project 4', id: '12312ssss12'},
      {name: 'Project 5', id: '12312ssss12ss'},
    ],
    showCreateProjectModal: false,
  };

  constructor(props) {
    super(props);
    this.addProjectButton = React.createRef();
  }

  showCreateProjectModal = () => {
    this.setState({showCreateProjectModal: true});
    ReactDOM.findDOMNode(this.addProjectButton.current).blur();
  };

  closeCreateProjectModal = () => {
    this.setState({showCreateProjectModal: false})
  };

  render() {

    const {projects, showCreateProjectModal} = this.state;
    const landingHeaderBackground = {
      'backgroundImage': `url('${require('@img/dashboard-test.svg')}')`,
    };
    return (
      <div className={'lading-page'}>
        <div className={'landing-header'} style={landingHeaderBackground}>
          <div className={'centered'}>
            <div className={'landing-text'}>
              <h2> Welcome to In&Out !</h2>
              <span>Create a project and start managing your income / outcome.</span>
              <br/>
              <span>Stay in control.</span>
            </div>
          </div>
        </div>
        <div className={'projects-container'}>
          <div className={'centered'}>
            {projects.length > 0 ? <div className={'title'}> Your Projects </div> : <Button color="primary"
                                                                                            onClick={this.showCreateProjectModal}>
              &#43; Add Project
            </Button>
            }
            <div className={'projects-inner'}>
              {
                projects.map(project => <ProjectCard key={project.id} project={project}/>)
              }
            </div>
          </div>
        </div>
        <CreateProjectModal open={showCreateProjectModal}
                            onClose={this.closeCreateProjectModal}/>
        <Tooltip title={'Add Project'} placement={'top'}>
          <Button variant="fab"
                  ref={this.addProjectButton}
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

export default Landing;

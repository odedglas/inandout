import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import CreateProjectModal from '@modal/CreateProject'
import Button from '@material-ui/core/Button';

class MobileLanding extends React.Component {

  state = {
    showCreateProjectModal: false,
  };

  showCreateProjectModal = () => {
    this.setState({showCreateProjectModal: true});
  };

  closeCreateProjectModal = () => {
    this.setState({showCreateProjectModal: false})
  };

  render() {
    const {showCreateProjectModal} = this.state;
    return (
      <div className={'mobile-welcome'}>

        <img src={require('@img/welcome.png')} alt='bg' />

        <div className={'text p-4 text-center'}>

          Its all starts with you project, create one now and start managing your expenses.
          <Button color="primary" className={'mt-2'} onClick={this.showCreateProjectModal}>
            &#43; CREATE Project
          </Button>
        </div>

        <CreateProjectModal open={showCreateProjectModal}
                            onClose={this.closeCreateProjectModal}/>

      </div>
    )
  }
}

export default compose(
  withRouter,
  connect(state => ({
    projects: state.projects,
  }), {})
)(MobileLanding);

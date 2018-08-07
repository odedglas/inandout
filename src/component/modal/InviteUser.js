import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DynamicIcon from '@common/DynamicIcon';
import TextField from '@material-ui/core/TextField';

import {inviteProjectMember} from '@action/project';

import validationService from '@service/validation';

class InviteUser extends Component {

  static propTypes = {
    users: PropTypes.arrayOf(PropTypes.object),
    selectedProject: PropTypes.object,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    inviteProjectMember: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
  };

  state = {
    mailInvite: '',
    error: undefined
  };

  setUserToInvite = (email) => {

    const {error} = this.state;

    if(error) {
      this.setState({
        mailInvite: email,
        error: validationService.isEmail(email) ? undefined : 'Please insert a valid email'
      });
    }
    else {

      this.setState({mailInvite: email});
    }
  };

  handleInvite = () => {

    const email = this.state.mailInvite;

    if(validationService.isEmail(email)) {

      this.props.inviteProjectMember(
        this.props.selectedProject,
        undefined,
        email,
        () => this.props.showNotification(`Invite was successfully sent to ${email}`)
      );

      this.props.onClose();

    }
    else {
      this.setState({error: 'Please insert a valid email'});
    }

  };

  render() {

    const {open, onClose, users} = this.props;
    const {mailInvite, error} = this.state;

    return (
      <Dialog
        open={open}
        disableRestoreFocus={true}
        onClose={onClose}
        className={'modal invite-user'}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className={'modal-title'}>
          <DynamicIcon name={'share'} className={'icon mr-3'}/>
          Invite User
        </DialogTitle>
        <DialogContent className={'modal-content'}>
          <DialogContentText>
            Share this project with other users, Note that if they will accept your invite, They'll have full access for you project.
          </DialogContentText>
          <div className={'row flex mb-3'}>

            <div className={'col-sm-12 px-0 mt-2'}>

              <TextField
                value={mailInvite}
                type={'text'}
                fullWidth
                onChange={(e) => this.setUserToInvite(e.target.value)}
                error={error !== undefined}
                title={error ? error : ''}
                placeholder={'someone@example.com'}
                label="Invite by email"
              />
            </div>

          </div>
        </DialogContent>
        <DialogActions className={'modal-actions'}>
          <Button onClick={this.handleInvite}
                  disabled={!mailInvite}
                  color="primary" autoFocus>
            Invite
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
  users: state.dashboard.users,
}), {inviteProjectMember})(InviteUser);
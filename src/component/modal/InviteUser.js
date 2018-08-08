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
import UsersSelect from '@common/UsersSelect';
import {inviteProjectMember} from '@action/project';

import validationService from '@service/validation';

const initialState ={
  mailInvite: '',
  existingUserId: undefined,
  error: undefined
};

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
    ...initialState
  };

  setEmailUserToInvite = (email) => {

    const {error} = this.state;

    if(error) {
      this.setState({
        mailInvite: email,
        error: validationService.isEmail(email) ? undefined : 'Please insert a valid email'
      });
    }
    else {

      this.setState({mailInvite: email, existingUserId: ''});
    }
  };

  setExitingUserToInvite = (userId) => {

    this.setState({
      existingUserId: userId,
      error: undefined,
      mailInvite: '',
    });
  };

  handleInvite = () => {

    const email = this.state.mailInvite;
    const existingUserId = this.state.existingUserId;

    if(validationService.isEmail(email) || existingUserId) {

      let existingUser =  this.props.users.find(u => u.id === existingUserId) || {};
      const inviteEmail = existingUser.email || email;

      this.props.inviteProjectMember(
        this.props.selectedProject,
        existingUser.email,
        inviteEmail,
        () => this.props.showNotification(`Invite was successfully sent to ${inviteEmail}`)
      );

      this.props.onClose();
    }
    else {

      this.setState({error: 'Please provide a valid email address.'})
    }

  };

  handleClose = () => {
    this.setState({...initialState});
    this.props.onClose();
  };

  render() {

    const {open} = this.props;
    const {mailInvite, error, existingUserId} = this.state;
    const canInvite = mailInvite || existingUserId;

    return (
      <Dialog
        open={open}
        disableRestoreFocus={true}
        onClose={this.handleClose}
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

              <UsersSelect selectedUser={existingUserId}
                           onChange={this.setExitingUserToInvite} />
            </div>

            <div className={'col-sm-12 px-0 mt-2'}>

              <TextField
                value={mailInvite}
                type={'text'}
                fullWidth
                onChange={(e) => this.setEmailUserToInvite(e.target.value)}
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
                  disabled={!canInvite}
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
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {hideConfirmation} from "@action/dashboard";

class AreYouSure extends Component {

  static propTypes = {
    showConfirmModal: PropTypes.bool.isRequired,
    confirmPayload: PropTypes.object,
    hideConfirmation: PropTypes.func.isRequired,
  };

  handleClose = () => {

    const { confirmPayload, hideConfirmation } = this.props;

    hideConfirmation();
    confirmPayload.onClose && confirmPayload.onClose();
  };

  handleConfirm = () => {

    const { confirmPayload, hideConfirmation } = this.props;

    confirmPayload.onConfirm && confirmPayload.onConfirm();
    hideConfirmation();
  };

  render() {

    const { showConfirmModal, confirmPayload} = this.props;

    return (
      <div>
        <Dialog
          open={showConfirmModal}
          onClose={this.handleClose}
          className={'are-you-sure'}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className={'title'}>
            {confirmPayload.title || 'Are You Sure ?'}
          </DialogTitle>
          <DialogContent className={'content'}>
            <DialogContentText>
              {confirmPayload.body}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={this.handleConfirm} color="secondary" >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default connect(state => ({
  showConfirmModal: state.dashboard.showConfirmModal,
  confirmPayload: state.dashboard.confirmPayload
}), {hideConfirmation})(AreYouSure);

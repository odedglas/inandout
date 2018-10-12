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
import DynamicIcon from "../common/DynamicIcon";

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

  handleButtonClick = (button) => {

    const { confirmPayload, hideConfirmation } = this.props;

    button.onClick(confirmPayload, hideConfirmation);

  };

  render() {

    const { showConfirmModal, confirmPayload} = this.props;
    const title = confirmPayload.title || 'Are You Sure ?';

    const hasCustomButtons = confirmPayload.buttons && confirmPayload.buttons.length > 0;

    return (
      <div>
        <Dialog
          open={showConfirmModal}
          disableRestoreFocus={true}
          onClose={this.handleClose}
          className={'are-you-sure'}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className={'title'}>
            <DynamicIcon name={confirmPayload.icon}/>
            {title}
          </DialogTitle>
          <DialogContent className={'content'}>
            <DialogContentText>
              {confirmPayload.body}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {
              hasCustomButtons ? <div>
                  {confirmPayload.buttons.map(button => (
                    <Button onClick={() => this.handleButtonClick(button)}
                            key={button.text.toLowerCase()}
                            color={button.color}>
                      {button.text}
                    </Button>
                  ))}
                </div>
                :
                <div>
                <Button onClick={this.handleClose} color="secondary" autoFocus>
                  Cancel
                </Button>
                <Button onClick={this.handleConfirm} color="primary" >
                  Confirm
                </Button>
              </div>
            }
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

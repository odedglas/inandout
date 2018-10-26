import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grow from '@material-ui/core/Grow';

class CreationModal extends React.Component {

  static propTypes = {
    validate: PropTypes.func.isRequired,
    clearValidation: PropTypes.func.isRequired,
    onValidationChange: PropTypes.func.isRequired,
    validation: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    getDerivedStateFromPropsHook: PropTypes.func,
    getInitialState: PropTypes.func.isRequired,
    model: PropTypes.object.isRequired,
    renderContent: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    context: PropTypes.string,
    editMode: PropTypes.bool,
    noPadding: PropTypes.bool,
  };

  static defaultProps = {
    noPadding: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      didClose:true,
      editInitialized: false,
      model: props.getInitialState()
    };

  }

  static getDerivedStateFromProps(props, state) {

    if(props.open) {
      if(props.editMode && !state.editInitialized) {

        return {
          model: props.model,
          editInitialized: true,
        }
      }

      if(!props.editMode && state.didClose) {

        return {
          model: props.getInitialState(),
          didClose: false,
          editInitialized: false,
        }
      }
    }
    else {

      return {
        editInitialized: false,
      }
    }

    return null;
  }

  handleChange = (value, name) => {

    const model = this.state.model;

    let update = model;
    update[name] = value;

    //Validating against new input
    this.props.onValidationChange(model, update, name);
    this.setState({model: update});
  };

  handleClose = () => {

    this.props.onClose();
    this.props.clearValidation();

    this.setState({ didClose: true, editInitialized: false });
  };

  handleCreate = () => {

    const {validate} = this.props;
    const model = this.state.model;

    const validationResult = validate(model);

    if (validationResult.isValid) {

      this.props.onCreate(model, this.handleClose);
    }
  };

  render() {

    const { open, title, editMode, context, validation, renderContent, noPadding} = this.props;
    const { model } = this.state;

    return (
      <div>
        <Dialog
          open={open}
          onClose={this.handleClose}
          disableRestoreFocus={true}
          TransitionComponent={Grow}
          transitionDuration={300}
          className={'modal'}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle className={'modal-title'}>
            <span>{title}</span>
          </DialogTitle>
          <DialogContent className={`modal-content ${noPadding ? 'p-0' : ''}`}>
            <DialogContentText>
              {context}
            </DialogContentText>

            {renderContent(model, validation, this.handleChange, editMode)}

          </DialogContent>
          <DialogActions className={'modal-actions'}>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleCreate}
                    color="primary"
                    variant="contained">
              {editMode ? 'Edit' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default CreationModal

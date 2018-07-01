import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grow from '@material-ui/core/Grow';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import DynamicIcon from '@common/DynamicIcon';

import withValidation from '../hoc/withValidation';
import { createCategory } from "@action/category";
import { PROJECT_TYPES } from '@const/';
import util from '@util/';
import themeService from '@service/theme';

const INITIAL_STATE = {
  name: '',
  icon: 'person',
  color: themeService.getAvatarRandomColor(600),
};

class CreateCategoryModal extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    clearValidation: PropTypes.func.isRequired,
    onValidationChange: PropTypes.func.isRequired,
    validation: PropTypes.object.isRequired,
    createCategory: PropTypes.func.isRequired,
    projectId: PropTypes.string,
  };

  state = {...INITIAL_STATE};

  handleChange = (value, name) => {
    let update = {};
    update[name] = value;

    //Validating against new input
    this.props.onValidationChange(this.state, update, name);
    this.setState(update);
  };

  handleCategoryCreate = () => {

    const { validate, createCategory, projectId} = this.props;
    const validationResult = validate(this.state);

    if(validationResult.isValid) {

      createCategory(projectId, this.state);
    }

  };

  handleClose = () => {
    this.props.clearValidation();
    this.setState({...INITIAL_STATE});
    this.props.onClose();
  };

  render() {

    const { open, validation} = this.props;
    const { name, icon, color } = this.state;

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
          <DialogTitle className={'modal-title'}>Create New Category</DialogTitle>
          <DialogContent className={'modal-content'}>
            <DialogContentText>
              Add new custom category to your project
            </DialogContentText>
            <div className={'form-control'}>
              <TextField
                autoFocus
                value={name}
                error={validation.name.isInvalid}
                placeholder={'My awesome project'}
                onChange={(event) => this.handleChange(event.target.value, 'name')}
                margin="dense"
                id="category-name"
                label="Category Name"
                title={validation.name.message}
                fullWidth
              />
            </div>
          </DialogContent>
          <DialogActions className={'modal-actions'}>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleCategoryCreate}
                    color="primary"
                    variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withValidation([
    {
      field    : 'name',
      method   : (v, f, state, validator, args) => !validator.isEmpty(v),
      message  : 'Please provide a category name.'
    },
  ]),
  connect( null, {createCategory})
)(CreateCategoryModal);

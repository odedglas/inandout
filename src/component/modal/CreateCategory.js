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
import Avatar from '@material-ui/core/Avatar';
import Grow from '@material-ui/core/Grow';

import DynamicIcon from '@common/DynamicIcon';
import ColorPicker from '@common/ColorPicker'
import IconPicker from '@common/IconPicker'

import withValidation from '../hoc/withValidation';
import {createCategory, editCategory} from "@action/category";

import themeService from '@service/theme';
import util from '@util/';

const INITIAL_STATE = {
  name: '',
  icon: 'person',
  color: themeService.getAvatarRandomColor(600),
  editMode: false,
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
    editCategory: PropTypes.func.isRequired,
    project: PropTypes.object,
    category: PropTypes.object,
  };

  state = {...INITIAL_STATE};

  static getDerivedStateFromProps(props, state) {

    const { category } = props;
    const { name } = state;

    if(category && !util.isEmptyObject(category) && name !== category.name && !state.editMode) {

      return {
        name: category.name,
        icon: category.icon,
        color: category.color,
        editMode: true
      }
    }

    return null;
  }

  handleChange = (value, name) => {
    let update = {};
    update[name] = value;

    //Validating against new input
    this.props.onValidationChange(this.state, update, name);
    this.setState(update);
  };

  handleCategoryCreate = () => {

    const {validate, createCategory, editCategory, project, category} = this.props;
    const {editMode} = this.state;

    const validationResult = validate(this.state);

    if (validationResult.isValid) {

      const {name, icon, color} = this.state;
      const method = editMode ? editCategory : createCategory;

      //Triggering Create / Edit
      method(
        project,
        {name, icon, color, id: category ? category.id : undefined},
        () => this.handleClose()
      );
    }

  };

  handleClose = () => {
    this.props.onClose();
    this.props.clearValidation();
    this.setState({
      ...INITIAL_STATE,
      color: themeService.getAvatarRandomColor(600)
    });
  };

  render() {

    const {open, validation} = this.props;
    const {name, icon, color, editMode} = this.state;

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
                placeholder={'My new category'}
                onChange={(event) => this.handleChange(event.target.value, 'name')}
                margin="dense"
                id="category-name"
                label="Category Name"
                title={validation.name.message}
                fullWidth
              />
            </div>

            <div className={'row py-1 category-theme'}>
              <div className={'col-sm-5 px-0 separator'}>
                <div className={'cell  mb-2'}>
                  <span className={'label'}>Color:</span>
                  <ColorPicker selectedColor={color}
                               onChange={color => this.handleChange(color, 'color')}/>
                </div>
                <div className={'cell'}>
                  <span className={'label'}>Icon:</span>
                  <IconPicker selectedIcon={icon}
                              onChange={icon => this.handleChange(icon, 'icon')}/>
                </div>
              </div>
              <div className={'col px-0'}>
                <div className={'preview'}>
                  <span className={'label pb-1'}>Preview</span>
                  <Avatar style={{'backgroundColor': color}} className={'category-avatar'}>
                    <DynamicIcon name={icon}/>
                  </Avatar>
                </div>
              </div>
            </div>
          </DialogContent>
          <DialogActions className={'modal-actions'}>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleCategoryCreate}
                    color="primary"
                    variant="contained">
              {!editMode ? 'Create' : 'Edit'}
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
      field: 'name',
      method: (v, f, state, validator, args) => !validator.isEmpty(v),
      message: 'Please provide a category name.'
    },
  ]),
  connect(null, {createCategory, editCategory})
)(CreateCategoryModal);

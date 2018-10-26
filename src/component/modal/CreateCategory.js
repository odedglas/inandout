import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';

import DynamicIcon from '@common/DynamicIcon';
import ColorPicker from '@common/ColorPicker'
import IconPicker from '@common/IconPicker'

import withValidation from '../hoc/withValidation';
import {createCategory, editCategory} from "@action/project";
import CreationModal from './CreationModal';
import themeService from '@service/theme';
import util from '@util/';

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
    createCallback: PropTypes.func,
    project: PropTypes.object,
    category: PropTypes.object,
  };

  handleCategoryCreate = (model, close) => {

    const {project, category, editCategory, createCategory, createCallback} = this.props;
    const {name, icon, color} = model;

    const editMode = category && !util.isEmptyObject(category);
    const method = editMode ? editCategory : createCategory;

    //Triggering Create / Edit
    method(
      project,
      {name, icon, color, id: editMode ? category.id : undefined},
      (category) => {

        createCallback && createCallback(category);
        close()
      }
    );

  };

  modalContent = (model, validation, handleChange) => (
    <div>
      <div className={'form-control'}>
        <TextField
          autoFocus
          value={model.name}
          error={validation.name.isInvalid}
          placeholder={'My new category'}
          onChange={(event) => handleChange(event.target.value, 'name')}
          id="category-name"
          label="Category Name"
          title={validation.name.message}
          fullWidth
        />
      </div>

      <div className={'row py-1 category-theme'}>
        <div className={'col-sm-6 px-0 separator'}>
          <div className={'cell  mb-2'}>
            <span className={'label'}>Color:</span>
            <ColorPicker selectedColor={model.color}
                         onChange={color => handleChange(color, 'color')}/>
          </div>
          <div className={'cell'}>
            <span className={'label'}>Icon:</span>
            <IconPicker selectedIcon={model.icon}
                        onChange={icon => handleChange(icon, 'icon')}/>
          </div>
        </div>
        <div className={'col px-0'}>
          <div className={'preview'}>
            <span className={'label pb-1'}>Preview</span>
            <Avatar style={{'backgroundColor': model.color}} className={'category-avatar'}>
              <DynamicIcon name={model.icon}/>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );

  render() {

    const {
      open,
      validation,
      clearValidation,
      validate,
      onClose,
      onValidationChange,
      category
    } = this.props;

    const editMode = category && !util.isEmptyObject(category);
    const model = editMode ? Object.create(category) : {};

    return (
      <CreationModal open={open}
                     onClose={onClose}
                     title={ editMode ? 'Edit Category' : 'Create Category'}
                     context={'Add new custom category to your project'}
                     editMode={editMode}
                     model={model}
                     getInitialState={() => ({
                       name: '',
                       icon: 'person',
                       color: themeService.getAvatarRandomColor(600),
                       editMode: false,
                     })}
                     renderContent={this.modalContent}
                     onCreate={this.handleCategoryCreate}
                     validate={validate}
                     validation={validation}
                     onValidationChange={onValidationChange}
                     clearValidation={clearValidation}/>
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

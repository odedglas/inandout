import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import InputAdornment from '@material-ui/core/InputAdornment';
import withValidation from '../hoc/withValidation';
import {createBudget, editBudget} from "@action/project";
import CreationModal from './CreationModal';

import util from '@util/';
import {BUDGETS_PERIOD} from '@const/';
import CategoriesSelect from '@common/CategoriesSelect';

class CreateBudgetModal extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    clearValidation: PropTypes.func.isRequired,
    onValidationChange: PropTypes.func.isRequired,
    validation: PropTypes.object.isRequired,
    createBudget: PropTypes.func.isRequired,
    editBudget: PropTypes.func.isRequired,
    project: PropTypes.object,
    budget: PropTypes.object,
  };

  handleBudgetCreate = (model, close) => {

    const {project, budget, editBudget, createBudget} = this.props;
    const {name, limit, period, categories} = model;

    const editMode = !util.isEmptyObject(budget);
    const method = editMode ? editBudget : createBudget;

    //Triggering Create / Edit
    method(
      project,
      {name, limit, period, categories, id: editMode ? budget.id : undefined},
      () => close()
    );

  };

  modalContent = (model, validation, handleChange) => {

    const {selectedProject} = this.props;

    return (
      <div>
        <div className={'form-control'}>
          <TextField
            autoFocus
            value={model.name}
            error={validation.name.isInvalid}
            placeholder={'My budget'}
            onChange={(event) => handleChange(event.target.value, 'name')}
            margin="dense"
            id="budget-name"
            label="Budget Name"
            title={validation.name.message}
            fullWidth
          />
        </div>

        <div className={'form-control'}>
          <TextField
            select
            fullWidth
            error={validation.period.isInvalid}
            placeholder={'Please set budget period'}
            label="Budget Period"
            helperText="Budget's period will be used to set budget start and end dates."
            value={model.period}
            onChange={(event) => handleChange(event.target.value, 'period')}
          >
            {BUDGETS_PERIOD.map(option => (
              <MenuItem key={option.key} value={option.key}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        <div className={'form-control'}>
          <TextField
            value={model.limit}
            error={validation.limit.isInvalid}
            placeholder={'Budget Limit'}
            onChange={(event) => handleChange(event.target.value, 'limit')}
            margin="dense"
            id="limit"
            label="Limit"
            title={validation.limit.message}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">{selectedProject.currency}</InputAdornment>,
            }}
          />
        </div>

        <CategoriesSelect selectedCategories={model.categories}
                          error={validation.categories.isInvalid}
                          onChange={(val) => handleChange(val, 'categories')}/>

      </div>
    );
  };

  render() {

    const {
      open,
      validation,
      clearValidation,
      validate,
      onClose,
      onValidationChange,
      budget
    } = this.props;

    const editMode = !util.isEmptyObject(budget);
    const model = editMode ? Object.create(budget) : {};

    if(model.categories) {

      model.categories = model.categories.map(c => c.id);
    }

    return (
      <CreationModal open={open}
                     onClose={onClose}
                     title={'Create Budget'}
                     context={'Add new budget to your project and manage your expenses'}
                     editMode={editMode}
                     model={model}
                     getInitialState={() => ({
                       name: '',
                       categories: [],
                       limit: '',
                       period: 'MONTHLY',
                       editMode: false,
                     })}
                     renderContent={this.modalContent}
                     onCreate={this.handleBudgetCreate}
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
      message: 'Please provide a budget name.'
    },
    {
      field: 'period',
      method: (v, f, state, validator, args) => !validator.isEmpty(v),
      message: 'Please provide a budget period.'
    },
    {
      field: 'limit',
      method: (v, f, state, validator, args) => {
        v = ''+v;
        return !validator.isEmpty(v) && validator.isNumeric(v) && v > 0
      },
      message: 'Please provide a budget limit, Must be over 0.'
    },
    {
      field: 'categories',
      method: (v, f, state, validator, args) => v.length > 0 && v.every(value => !validator.isEmpty(value)),
      message: 'Please Select budget categories'
    },
  ]),
  connect(state => ({
    selectedProject: state.project.selectedProject
  }), {createBudget, editBudget})
)(CreateBudgetModal);

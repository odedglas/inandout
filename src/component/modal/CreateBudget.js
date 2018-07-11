import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';

import withValidation from '../hoc/withValidation';
import {createBudget, editBudget} from "@action/project";
import CreationModal from './CreationModal';

import util from '@util/';

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

  modalContent = (model, validation, handleChange) => (
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
      budget
    } = this.props;

    const editMode = !util.isEmptyObject(budget);
    const model = editMode ? Object.create(budget) : {};

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
                       limit: undefined,
                       period: undefined,
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
  ]),
  connect(null, {createBudget, editBudget})
)(CreateBudgetModal);

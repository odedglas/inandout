import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import TextField from '@material-ui/core/TextField';

import withValidation from '../hoc/withValidation';
import {createCustomer, editCustomer} from "@action/project";
import CreationModal from './CreationModal';

import util from '@util/';
import {ProjectType} from "@model/project";
import {CustomerType} from "@model/customer";

class CreateCustomerModal extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    clearValidation: PropTypes.func.isRequired,
    onValidationChange: PropTypes.func.isRequired,
    validation: PropTypes.object.isRequired,
    editCustomer: PropTypes.func.isRequired,
    createCustomer: PropTypes.func.isRequired,
    confirmCallback: PropTypes.func,
    project: ProjectType,
    customer: PropTypes.oneOfType([CustomerType, PropTypes.object]),
  };

  handleCustomerCreate = (model, close) => {

    const {project, customer, editCustomer, createCustomer, confirmCallback} = this.props;
    const {name, contactName, phone, email, address, logo} = model;

    const editMode = !util.isEmptyObject(customer);
    const method = editMode ? editCustomer : createCustomer;

    //Triggering Create / Edit
    method(
      project,
      {name, contactName, phone, email, address, logo, id: editMode ? customer.id : undefined},
      (customer) => {
        confirmCallback && confirmCallback(customer);
        close();
      }
    );

  };

  modalContent = (model, validation, handleChange) => {

    return (
      <div>
        <div className={'form-control'}>
          <TextField
            autoFocus
            value={model.name}
            error={validation.name.isInvalid}
            onChange={(event) => handleChange(event.target.value, 'name')}
            margin="dense"
            label="Business Name"
            title={validation.name.message}
            fullWidth
          />
        </div>

        <div className={'form-control'}>
          <TextField
            value={model.contactName}
            error={validation.contactName.isInvalid}
            onChange={(event) => handleChange(event.target.value, 'contactName')}
            margin="dense"
            label="Contact Name"
            title={validation.contactName.message}
            fullWidth
          />
        </div>

        <div className={'form-control'}>
          <TextField
            value={model.phone}
            error={validation.phone.isInvalid}
            onChange={(event) => handleChange(event.target.value, 'phone')}
            margin="dense"
            label="Phone Number"
            title={validation.phone.message}
            fullWidth
          />
        </div>

        <div className={'form-control'}>
          <TextField
            value={model.email}
            error={validation.email.isInvalid}
            placeholder={'someone@example.com'}
            onChange={(event) => handleChange(event.target.value, 'email')}
            margin="dense"
            label="Email"
            title={validation.email.message}
            fullWidth
          />
        </div>

        <div className={'form-control'}>

          <TextField
            value={model.address}
            error={validation.address.isInvalid}
            placeholder={'Tel Aviv, Ruppin 24'}
            onChange={(event) => handleChange(event.target.value, 'address')}
            margin="dense"
            label="Adress"
            title={validation.address.message}
            fullWidth
          />
        </div>
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
      customer
    } = this.props;

    const editMode = !util.isEmptyObject(customer);
    const model = editMode ? Object.create(customer) : {};

    return (
      <CreationModal open={open}
                     onClose={onClose}
                     title={ editMode ? 'Edit Customer' : 'Create Customer'}
                     editMode={editMode}
                     model={model}
                     getInitialState={() => ({
                       name: '',
                       contactName: '',
                       phone: '',
                       email: '',
                       address: '',
                       star: false,
                       logo: undefined,
                     })}
                     renderContent={this.modalContent}
                     onCreate={this.handleCustomerCreate}
                     validate={validate}
                     validation={validation}
                     onValidationChange={onValidationChange}
                     clearValidation={clearValidation}/>
    );
  }
}

export default compose(
  withValidation([
    {
      field: 'name',
      method: (v, f, state, validator, args) => !validator.isEmpty(v),
      message: 'Please provide a customer name.'
    },
    {
      field: 'contactName',
      method: (v, f, state, validator, args) => true,
    },
    {
      field: 'phone',
      method: (v, f, state, validator, args) => validator.isMobilePhone(v, 'any'),
      message: 'Please provide a customer phone number.'
    },
    {
      field: 'email',
      method: (v, f, state, validator, args) => validator.isEmail(v),
      message: 'Please provide a customer email.'
    },
    {
      field: 'address',
      method: (v, f, state, validator, args) => !validator.isEmpty(v),
      message: 'Please provide a customer address.'
    }
  ]),
  connect(state => ({
    selectedProject: state.project.selectedProject
  }), {createCustomer, editCustomer})
)(CreateCustomerModal);

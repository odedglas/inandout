import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import MaskedInput from 'react-text-mask';
import TextField from '@material-ui/core/TextField';

import withValidation from '../hoc/withValidation';
import {createCustomer, editCustomer} from "@action/project";
import CreationModal from './CreationModal';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import util from '@util/';
import {ProjectType} from "@model/project";
import {CustomerType} from "@model/customer";
import DynamicIcon from "../common/DynamicIcon";

function TextMaskCustom(props) {
  const {inputRef, ...other} = props;

  return (
    <MaskedInput
      {...other}
      ref={inputRef}
      placeholder="(052) 240-4223"
      guide={false}
      keepCharPositions={true}
      mask={[
        '(',
        /[0-9]/,
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        /\d/,
        /\d/
      ]}
      placeholderChar={'\u2000'}
      showMask={true}
    />
  );
}

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
    customer: PropTypes.oneOfType([
      CustomerType,
      PropTypes.object
    ]),
  };

  handleCustomerCreate = (model, close) => {

    const {project, customer, editCustomer, createCustomer, confirmCallback} = this.props;
    const {name, contactName, phone, email, address, logo, additionalPhoneNumber, additionalContactName} = model;

    const editMode = !util.isEmptyObject(customer);
    const method = editMode ? editCustomer : createCustomer;

    //Triggering Create / Edit
    method(
      project,
      {name, contactName, phone, email, address, logo, id: editMode ? customer.id : undefined, additionalPhoneNumber, additionalContactName},
      (customer) => {
        confirmCallback && confirmCallback(customer);
        close();
      }
    );

  };

  modalContent = (model, validation, handleChange) => {

    const showAdditionalContacts = model.showAdditionalContact || model.additionalPhoneNumber;

    return (
      <div>
        <div className={'form-control'}>
          <TextField
            autoFocus
            value={model.name}
            error={validation.name.isInvalid}
            onChange={(event) => handleChange(event.target.value, 'name')}
            label="Business Name"
            title={validation.name.message}
            fullWidth
          />
        </div>

        <div className={'form-control'}>
          <TextField
            value={model.email}
            error={validation.email.isInvalid}
            placeholder={'someone@example.com'}
            onChange={(event) => handleChange(event.target.value, 'email')}
            label="Email"
            title={validation.email.message}
            fullWidth
          />
        </div>

        <div className={'form-control'}>

          <TextField
            value={model.address}
            placeholder={'Tel Aviv, Ruppin 24'}
            onChange={(event) => handleChange(event.target.value, 'address')}
            label="Adress"
            fullWidth
          />
        </div>

        <div>
          <div className={'customer-contacts mb-2'}>
            <span> Contacts info </span>
            {
              !showAdditionalContacts &&
              <IconButton onClick={(event) => handleChange(true, 'showAdditionalContact')}>
                <DynamicIcon name={'addPerson'}/>
              </IconButton>
            }
          </div>
          <div className={'row'}>
            <div className={'col-sm-6 pl-0'}>
              <div className={'form-control'}>
                <TextField
                  value={model.contactName}
                  error={validation.contactName.isInvalid}
                  onChange={(event) => handleChange(event.target.value, 'contactName')}
                  label="Contact Name"
                  title={validation.contactName.message}
                  fullWidth
                />
              </div>
            </div>
            <div className={'col-sm-6'}>
              <div className={'form-control col-flex'}>
                <InputLabel htmlFor="phoneNumber">Phone Number</InputLabel>
                <Input
                  value={model.phone}
                  error={validation.phone.isInvalid}
                  title={validation.phone.message}
                  onChange={(event) => handleChange(event.target.value, 'phone')}
                  id="phoneNumber"
                  fullWidth
                  inputComponent={TextMaskCustom}
                />

              </div>
            </div>
          </div>
          {
            showAdditionalContacts ? <div className={'row'}>
              <div className={'col-sm-6 pl-0'}>
                <div className={'form-control'}>
                  <TextField
                    value={model.additionalContactName || ''}
                    onChange={(event) => handleChange(event.target.value, 'additionalContactName')}
                    label="Contact Name"
                    fullWidth
                  />
                </div>
              </div>
              <div className={'col-sm-6'}>
                <div className={'form-control col-flex'}>
                  <InputLabel htmlFor="additionalPhoneNumber">Phone Number</InputLabel>
                  <Input
                    value={model.additionalPhoneNumber || ''}
                    onChange={(event) => handleChange(event.target.value, 'additionalPhoneNumber')}
                    id="additionalPhoneNumber"
                    fullWidth
                    inputComponent={TextMaskCustom}
                  />

                </div>
              </div>
            </div> : null
          }
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
                     title={editMode ? 'Edit Customer' : 'Create Customer'}
                     editMode={editMode}
                     model={model}
                     getInitialState={() => ({
                       name: '',
                       contactName: '',
                       phone: '',
                       additionalContactName: '',
                       additionalPhoneNumber: '',
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
      method: (v, f, state, validator, args) => !validator.isEmpty(v),
    },
    {
      field: 'phone',
      method: (v, f, state, validator, args) => validator.isMobilePhone(v, 'any'),
      message: 'Please provide a customer phone number.'
    },
    {
      field: 'additionalContactName',
      method: (v, f, state, validator, args) => true,
    },
    {
      field: 'additionalPhoneNumber',
      method: (v, f, state, validator, args) => true
    },
    {
      field: 'email',
      method: (v, f, state, validator, args) => validator.isEmail(v),
      message: 'Please provide a customer email.'
    },
  ]),
  connect(state => ({
    selectedProject: state.project.selectedProject
  }), {createCustomer, editCustomer})
)(CreateCustomerModal);

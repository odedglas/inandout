import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {
  withRouter
} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import {DateTimePicker} from 'material-ui-pickers';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import CustomersSelect from '@common/CustomersSelect';
import withValidation from '../hoc/withValidation';
import {
  createEvent,
  editEvent,
  deleteEvent,
  markEventComplete,
  attachEventTransaction,
  fetchEventTransaction
} from "@action/project";
import CreationModal from './CreationModal';

import util from '@util/';
import dateUtil from '@util/date';
import {EVENT_TYPE} from '@const/'
import themeService from '@service/theme';
import calendarService from '@service/calendar';

class CreateEventModal extends React.Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    isValid: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    clearValidation: PropTypes.func.isRequired,
    onValidationChange: PropTypes.func.isRequired,
    validation: PropTypes.object.isRequired,
    createEvent: PropTypes.func.isRequired,
    editEvent: PropTypes.func.isRequired,
    deleteEvent: PropTypes.func.isRequired,
    markEventComplete: PropTypes.func.isRequired,
    attachEventTransaction: PropTypes.func.isRequired,
    fetchEventTransaction: PropTypes.func.isRequired
  };

  handleEventCreate = (model, close) => {

    const {selectedProject, event, editEvent, createEvent} = this.props;

    const editMode = !util.isEmptyObject(event);
    const method = editMode ? editEvent : createEvent;

    //Triggering Create / Edit
    method(
      selectedProject,
      model,
      () => close()
    );

  };

  modalContent = (model, validation, handleChange, editMode, customers) => {

    const isEventType = model.type === 'EVENT';

    const handleCustomerSelect = (customerId) => {
      if(!model.location) {
        const customer = customers.find(c => c.id === customerId);
       handleChange(customer.address, 'location')
      }
    };

    return (
      <div className={'content'}>

        <div className={'form-control'}>

          <TextField
            value={model.title}
            title={validation.title.message}
            error={validation.title.isInvalid}
            onChange={(event) => this.handleChange(event.target.value, 'title')}
            placeholder="Add Title"
            fullWidth
          />
        </div>

        <div className={'form-control'}>
          <div className="picker">
            <DateTimePicker
              value={model.date}
              title={validation.date.message}
              error={validation.date.isInvalid}
              onOpen={this.onPopperPickerOpen}
              onClose={this.onPopperPickerClose}
              onChange={(date) => this.handleChange(date.toDate().getTime(), 'date')}
              placeholder="Date"
              fullWidth
            />
          </div>
        </div>

        <CustomersSelect customer={model.customer}
                         onClose={this.onPopperPickerClose}
                         onOpen={this.onPopperPickerOpen}
                         onChange={(val) => {
                           this.handleChange(val, 'customer');
                           handleCustomerSelect(val)
                         }}/>

        {
          isEventType ?
            <TextField
              value={model.location}
              onChange={(event) => this.handleChange(event.target.value, 'location')}
              placeholder="Location"
              fullWidth
            /> : null
        }

      </div>
    )
  };

  render() {

    const {
      open,
      validation,
      clearValidation,
      validate,
      onClose,
      onValidationChange,
      event
    } = this.props;

    const editMode = !util.isEmptyObject(event);
    const model = (editMode&& event) ? Object.create(event) : {};

    if(model.customer) {

      model.customer = model.customer.id
      console.log("After transform customers are : " , model.customer);
    }

    return (
      <CreationModal open={open}
                     onClose={onClose}
                     title={ editMode ? 'Edit Event' : 'Create Event'}
                     editMode={editMode}
                     model={model}
                     getInitialState={() => ({
                       type: 'EVENT',
                       date: dateUtil.today().setHours(12),
                       title: '',
                       description: '',
                       color: themeService.getAvatarRandomColor('600'),
                       customer: '',
                       location: '',
                       editMode: false,
                     })}
                     renderContent={(...args) => this.modalContent(...args,this.props.customers)}
                     onCreate={this.handleEventCreate}
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
      field: 'title',
      method: (v, f, state, validator, args) => !validator.isEmpty(v),
      message: 'Please fill the event title.'
    },
    {
      field: 'date',
      method: (v, f, state, validator, args) => !validator.isEmpty('' + v),
      message: 'Please select event date.'
    },
    {
      field: 'customer',
      method: (v, f, state, validator, args) => true
    },
  ]),
  connect(state => ({
    selectedProject: state.project.selectedProject,
    customers: state.project.customers
  }), {
    createEvent,
    editEvent,
    deleteEvent,
    markEventComplete,
    attachEventTransaction,
    fetchEventTransaction
  })
)(CreateEventModal);

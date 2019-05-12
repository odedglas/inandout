import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import {
  withRouter
} from 'react-router-dom';

import TextField from '@material-ui/core/TextField';
import {DateTimePicker} from 'material-ui-pickers';
import Button from '@material-ui/core/Button';
import CustomersSelect from '@common/CustomersSelect';
import CreateTransaction from '@modal/CreateTransaction'
import withValidation from '../hoc/withValidation';
import {
  createEvent,
  editEvent,
  deleteEvent,
  markEventComplete,
  attachEventTransaction,
  fetchEventTransaction,
  createTransaction,
  updateTransaction
} from "@action/project";
import CreationModal from './CreationModal';

import util from '@util/';
import dateUtil from '@util/date';
import themeService from '@service/theme';
import calendarService from '@service/calendar';
import DynamicIcon from '../common/DynamicIcon';

class CreateEventModal extends React.Component {

  state = {
    showTransactionModal: false,
    transactionCreateState: {},
    transactionForEdit: {},
  };

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

    const {project, event, editEvent, createEvent} = this.props;

    const editMode = !util.isEmptyObject(event);
    const method = editMode ? editEvent : createEvent;

    //Triggering Create / Edit
    method(
      project,
      model,
      () => close()
    );

  };

  modalContent = (model, validation, handleChange, editMode, customers) => {

    const handleCustomerSelect = (customerId) => {
      if (!model.location) {
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
            onChange={(event) => handleChange(event.target.value, 'title')}
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
              onChange={(date) => handleChange(date.toDate().getTime(), 'date')}
              placeholder="Date"
              fullWidth
            />
          </div>
        </div>

        <CustomersSelect customer={model.customer}
                         onChange={(val) => {
                           handleChange(val, 'customer');
                           handleCustomerSelect(val)
                         }}/>

        <TextField
          value={model.location}
          onChange={(event) => handleChange(event.target.value, 'location')}
          placeholder="Location"
          fullWidth
        />


        {this.transactionContent(model, handleChange, editMode)}

      </div>
    )
  };

  transactionContent = (model, handleChange, editMode) => {

    const isCompleted = model.completed === true;
    const isOverdue = editMode && dateUtil.isBefore(model.date, dateUtil.now());
    const transactionReported = isCompleted && model.transaction !== undefined;

    if (!isOverdue) {
      return null;
    }

    return (

      <div className={'row p-3 just-c'}>
        <Button onClick={() => this.handleTransactionModalShow(transactionReported, model)}
                color="secondary">
          <DynamicIcon name={transactionReported ? 'transactions' : 'add'}/>
          {transactionReported ? 'View Transaction' : 'Add Transaction'}
        </Button>
      </div>
    )
  };

  handleTransactionModalShow = (fetchTransaction, event) => {

    if (fetchTransaction) {
      this.props.fetchEventTransaction(event, (transaction) => {

        this.setState({
          showTransactionModal: true,
          transactionForEdit: transaction
        })
      });
    }
    else {
      this.setState({
        showTransactionModal: true,
        transactionCreateState: calendarService.transformEventToTransaction(
          event
        ),
      })
    }

  };

  handleTransactionCrud = (transaction, action, cb) => {

    const {event, updateTransaction, createTransaction} = this.props;

    if (action === 'add') {

      createTransaction(
        this.props.project,
        {
          ...transaction,
          sourceEventId: event.id
        },
        (transaction) => {

          this.props.attachEventTransaction(
            this.props.project,
            event.id,
            transaction,
            cb
          );
        }
      )
    }
    else {

      updateTransaction(
        this.props.project,
        transaction,
        cb
      );
    }

  };

  handleTransactionModalHide = () => this.setState({showTransactionModal: false, transactionCreateState: {}, transactionForEdit: {}});

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

    const {showTransactionModal, transactionForEdit, transactionCreateState} = this.state;

    const editMode = !util.isEmptyObject(event);
    const model = (editMode && event) ? Object.create(event) : {};

    if (model.customer) {
      model.customer = model.customer.id;
    }

    return (
      <React.Fragment>
        <CreationModal open={open}
                       onClose={onClose}
                       title={editMode ? 'Edit Event' : 'Create Event'}
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
                       renderContent={(...args) => this.modalContent(...args, this.props.customers)}
                       onCreate={this.handleEventCreate}
                       validate={validate}
                       validation={validation}
                       onValidationChange={onValidationChange}
                       clearValidation={clearValidation}/>

        <CreateTransaction open={showTransactionModal}
                           createInitialState={transactionCreateState}
                           transaction={transactionForEdit}
                           transactionCrudHandler={this.handleTransactionCrud}
                           onClose={this.handleTransactionModalHide}/>
      </React.Fragment>
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
    project: state.project.selectedProject,
    customers: state.project.customers
  }), {
    createEvent,
    editEvent,
    deleteEvent,
    markEventComplete,
    attachEventTransaction,
    fetchEventTransaction,
    createTransaction,
    updateTransaction
  })
)(CreateEventModal);

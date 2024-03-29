import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import DynamicIcon from '@common/DynamicIcon';

import CreateBudget from '@modal/CreateBudget'
import CreateTransaction from '@modal/CreateTransaction'
import CreateCategory from '@modal/CreateCategory'
import CreateCustomer from '@modal/CreateCustomer'
import CreateEvent from '@modal/CreateEvent'
import InviteUser from '@modal/InviteUser'

import {createTransaction,} from "@action/project";

const actions = [
  {key: 'showCreateTransactionModal',icon: <DynamicIcon name={'transactions'}/>, name: 'Create Transaction'},
  {key: 'showCreateCategoryModal',icon: <DynamicIcon name={'categories'}/>, name: 'Create Category'},
  {key: 'showCreateEventModal',icon: <DynamicIcon name={'calendar'}/>, name: 'Create Event'},
  {key: 'showCreateCustomerModal',icon: <DynamicIcon name={'customers'}/>, name: 'Create Customer'},
  {key: 'showCreateBudgetModal', icon: <DynamicIcon name={'budgets'}/>, name: 'Create Budget'},
  {key: 'showInviteModal',icon: <DynamicIcon name={'share'}/>, name: 'Invite'},
];

class HomeCreateDial extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    showNotification: PropTypes.func.isRequired,
    createTransaction: PropTypes.func.isRequired,
  };

  state = {
    open: false,
    showInviteModal: false,
    showCreateBudgetModal: false,
    showCreateEventModal: false,
    showCreateTransactionModal: false,
    showCreateCategoryModal: false,
    showCreateCustomerModal: false,
  };

  toggleDialMenu = () => {

    this.setState(state => ({
      open: !state.open,
    }));
  };

  closeDialMenu = () => {
    this.setState({
      open: false,
    });
  };

  toggleDialogModalState = (modalShowProp) => {

      this.setState(state => ({
        [modalShowProp]: !state[modalShowProp],
      }))
  };

  handleTransactionCrud = (transaction, action, cb) => {

    if(action === 'add') {

      this.props.createTransaction(
        this.props.selectedProject,
        transaction,
        cb
      )
    }
  };

  render() {

    const {selectedProject, showNotification}  = this.props;
    const {
      open,
      showCreateBudgetModal,
      showCreateEventModal,
      showCreateTransactionModal,
      showCreateCategoryModal,
      showCreateCustomerModal,
      showInviteModal,
    } = this.state;

    return (
      <div className={'project-speed-dial fab'} style={{'pointerEvents': 'none'}}>
        <ClickAwayListener onClickAway={this.closeDialMenu}>
          <SpeedDial
            ariaLabel="SpeedDial example"
            icon={<SpeedDialIcon/>}
            onClick={this.toggleDialMenu}
            onClose={this.closeDialMenu}
            open={open}
          >
            {actions.map(action => (
              <SpeedDialAction
                key={action.key}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => {
                  this.toggleDialogModalState(action.key);
                  this.toggleDialMenu();
                }}
              />
            ))}
          </SpeedDial>
        </ClickAwayListener>

        <InviteUser open={showInviteModal}
                    showNotification={showNotification}
                    onClose={() => this.toggleDialogModalState('showInviteModal')}/>

        <CreateBudget open={showCreateBudgetModal}
                      budget={{}}
                      project={selectedProject}
                      onClose={() => this.toggleDialogModalState('showCreateBudgetModal')}/>

        <CreateTransaction open={showCreateTransactionModal}
                           transaction={{}}
                           transactionCrudHandler={this.handleTransactionCrud}
                           onClose={() => this.toggleDialogModalState('showCreateTransactionModal')}/>

        <CreateCategory open={showCreateCategoryModal}
                        project={selectedProject}
                        onClose={() => this.toggleDialogModalState('showCreateCategoryModal')}/>

        <CreateCustomer open={showCreateCustomerModal}
                        project={selectedProject}
                        customer={{}}
                        onClose={() => this.toggleDialogModalState('showCreateCustomerModal')}/>

        <CreateEvent open={showCreateEventModal}
                        event={{}}
                        onClose={() => this.toggleDialogModalState('showCreateEventModal')}/>
      </div>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {createTransaction})(HomeCreateDial);

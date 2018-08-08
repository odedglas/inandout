import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import MenuItem from '@material-ui/core/MenuItem';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DynamicIcon from "@common/DynamicIcon";
import UserAvatar from '@common/UserAvatar';

const MenuProps = {
  PaperProps: {
    style: {
      transform: 'translate3d(0, 0, 0)',
      maxHeight: 300,
      width: 350,
    },
  },
};

class UsersSelect extends Component {

  static propTypes = {
    selectedUser: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.bool,
    users: PropTypes.arrayOf(PropTypes.object),
    onOpen: PropTypes.func,
    onClose: PropTypes.func
  };

  state = {
    open: false,
  };

  handleClose = () => {
    this.props.onClose && this.props.onClose();
    this.setState({open: false});
  };

  handleOpen = () => {
    this.props.onOpen && this.props.onOpen();
    this.setState({open: true});
  };

  render() {

    const {
      users,
      selectedUser,
      onChange,
      error,
      showCreateNewCustomer,
    } = this.props;

    return (
      <FormControl className={'form-control w-100'} error={error}>
        <InputLabel>User</InputLabel>
        <Select
          open={this.state.open}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          value={selectedUser || ''}
          onChange={(event) => onChange(event.target.value)}
          input={<Input className={'w-100'}/>}
          renderValue={selected => {
            const user = users.find(c => c.id === selected);

            return (
              <div style={{'whiteSpace': 'initial'}}>
                {
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <UserAvatar user={user} size={'small'} />
                    <span className={'mx-3'}>{user.displayName}</span>
                  </div>
                }
              </div>
            )
          }}
          MenuProps={MenuProps}
        >
          {users.map(user => (
            <MenuItem
              key={user.id}
              value={user.id}>
              <ListItemIcon className={'menu-icon'}>
                <UserAvatar user={user} size={'medium white'} />
              </ListItemIcon>
              <ListItemText className={'menu-text'}
                            secondary={user.email}
                            primary={user.displayName}/>
            </MenuItem>
          ))}

          {
            showCreateNewCustomer ? <div key={'add-customer'} value={'add-customer'} className={'flex'}>
              <Button size="small" color="primary" style={{'flex': 1}} onClick={() => this.showHideCreateCustomerModal(true)}>
                <DynamicIcon name={'add'}/>
                Add new Customer
              </Button>
            </div> : null
          }

        </Select>
      </FormControl>
    )
  }
}

export default connect(state => ({
  users: state.dashboard.users
}), {})(UsersSelect);


import React, {Component} from 'react';
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import DynamicIcon from '@common/DynamicIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {CustomerType} from "@model/customer";

class CustomersList extends Component {

  static propTypes = {
    customers: PropTypes.arrayOf(CustomerType),
    showHideCreateCustomerModal: PropTypes.func.isRequired
  };

  state = {
    anchorEl: null,
    search: '',
  };

  handleMenuClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSearchChange = (val) => this.setState({search: val});

  render() {

    const {customers, showHideCreateCustomerModal} = this.props;
    const {anchorEl, search} = this.state;

    const hasCustomers = customers.length > 0;
    const hasSearch = search !== '';

    const _customers = hasSearch ? customers.filter(c => {
      return c.name.includes(search) || c.contactName.includes(search) || c.email.includes(search);
    }) : customers;

    const hasNoSearchResults = hasSearch && _customers.length === 0;

    return (
      <Paper className={'mt-2 mx-4'} style={{flex: 1}}>
        <div className={'row search-row'}>
          <div className={'search-wrapper'}>
            <DynamicIcon className={'icon'} name={'search'}/>
            <input className={`search-control ${hasSearch ? 'active' : ''}`}
                   placeholder="Search customer"
                   type={'text'}
                   value={search}
                   onChange={e => this.handleSearchChange(e.target.value)}/>
          </div>
        </div>
        <div className={'customers-list-wrapper'}>
          {
            hasCustomers ? <div className={'row'}>
                {_customers.map(customer => (
                  <div className={'customer-row col-sm-12'} key={customer.id}>

                    <IconButton className={`icon px-1 ${customer.star ? 'active' : ''}`}>
                      <DynamicIcon name={customer.star ? 'start' : 'star-empty'}/>
                    </IconButton>

                    <div className={'logo mx-3'}>
                      <Avatar className={'avatar medium'}
                              style={{backgroundColor: customer.avatarColor}}>
                        {customer.initials}
                      </Avatar>
                    </div>

                    <div className={'col-flex px-2'}>

                      <p className={'contact-title m-0'}>
                        {customer.name} <span className={'separator'}></span> {customer.contactName}
                      </p>
                      <div className={'contact-info'}>
                        {customer.email}, {customer.phone}
                      </div>
                    </div>

                    <div>
                      <IconButton className={'category-menu-trigger'}
                                  aria-label="More"
                                  aria-owns={anchorEl ? 'customer-menu' : null}
                                  aria-haspopup="true"
                                  onClick={this.handleMenuClick}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </div>

                  </div>))}

                {
                  hasNoSearchResults ?
                    <div className={'empty-results pt-4'}>
                    <img src={require('@img/empty-search-results.png')} alt={'no-customers'}/>
                    <div>
                      No customers that match current search were found.
                      <br/>
                    </div>
                  </div> : null
                }
              </div>
              :
              <div className={'empty-customers'}>
                <img src={require('@img/no-customers.png')} alt={'no-customers'}/>
                <div>
                  There are no customers on this project yet.
                  <br/>
                  <Button color="primary" className={'mt-2'} size={'small'}
                          onClick={showHideCreateCustomerModal}>
                    &#43; Create Customer
                  </Button>
                </div>
              </div>
          }
        </div>
        <Menu
          id="customer-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleMenuClose}>

          <MenuItem>
            Delete
          </MenuItem>
          <MenuItem>
            Edit
          </MenuItem>
        </Menu>

      </Paper>
    );
  }
}

export default CustomersList;
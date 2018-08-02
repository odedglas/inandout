import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import DynamicIcon from '@common/DynamicIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {CustomerType} from "@model/customer";
import {setStarred, deleteCustomer} from "@action/project";
import {showConfirmation} from "@action/dashboard";
import util from '@util/';

class CustomersList extends Component {

  static propTypes = {
    selectedProject: PropTypes.object,
    customers: PropTypes.arrayOf(CustomerType),
    showHideCreateCustomerModal: PropTypes.func.isRequired,
    showConfirmation: PropTypes.func.isRequired,
    deleteCustomer: PropTypes.func.isRequired,
    setStarred: PropTypes.func.isRequired
  };

  state = {
    anchorEl: null,
    anchorCustomer: null,
    search: '',
  };

  handleMenuClick = (event, customer) => {
    this.setState({ anchorEl: event.currentTarget, anchorCustomer: customer });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null, anchorCustomer: null });
  };

  handleSearchChange = (val) => this.setState({search: val});

  handleDelete = () => {

    const {showConfirmation, deleteCustomer} = this.props;
    const {anchorCustomer} = this.state;

    showConfirmation({
      title:'Delete This Customer ?',
      body: 'Deleting this customer will remove it from all it\'s related transactions',
      icon: 'delete',
      onConfirm: () => {

        deleteCustomer(this.props.selectedProject, anchorCustomer.id);
      }
    });

    this.handleMenuClose();
  };

  handleCustomerStar = (customer) => {

    const {setStarred, selectedProject} = this.props;

    setStarred(
      selectedProject,
      {
        id: customer.id,
        star: !customer.star
      }
    )
  };

  handleEdit = () => {

    const {showHideCreateCustomerModal} = this.props;
    const {anchorCustomer} = this.state;

    showHideCreateCustomerModal(true, anchorCustomer);
    this.handleMenuClose();
  };

  render() {

    const {customers, showHideCreateCustomerModal} = this.props;
    const {anchorEl, search} = this.state;

    const hasCustomers = customers.length > 0;
    const hasSearch = search !== '';

    const _customers = (hasSearch ? customers.filter(c => {
      return c.name.includes(search) || c.contactName.includes(search) || c.email.includes(search);
    }) : customers).sort(util.sortJsonFN([{name: 'star', reverse: true}, {name: 'created'}]));

    const hasNoSearchResults = hasSearch && _customers.length === 0;

    return (
      <Paper className={'mt-2 mx-4'} style={{flex: 1}}>
        <div className={'row search-row'}>
          <div className={'search-wrapper'}>
            <DynamicIcon className={'icon'} name={'search'}/>
            <input className={`search-control ${hasSearch ? 'active' : ''}`}
                   placeholder="Search customer"
                   disabled={!hasCustomers}
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

                    <IconButton onClick={() => this.handleCustomerStar(customer)}
                                className={`icon px-1 ${customer.star ? 'active' : ''}`}>
                      <DynamicIcon name={customer.star ? 'star' : 'star-empty'}/>
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
                                  onClick={e => this.handleMenuClick(e, customer)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </div>

                  </div>
                ))}

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
          <MenuItem onClick={this.handleEdit}>
            Edit
          </MenuItem>
          <MenuItem onClick={this.handleDelete}>
            Delete
          </MenuItem>
        </Menu>

      </Paper>
    );
  }
}

export default connect(state => ({
  selectedProject: state.project.selectedProject,
}), {
  deleteCustomer,
  setStarred,
  showConfirmation
})(CustomersList);
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FilterListIcon from '@material-ui/icons/FilterList';

class TransactionFilter extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    filter: PropTypes.arrayOf(PropTypes.object),
    hideFilter: PropTypes.func.isRequired,
  };

  handleClose = () => {

    this.props.hideFilter();
  };

  doFilter = () => {

    this.props.hideFilter();
  };

  render() {

    const { open } = this.props;

    return (
      <div>
        <Dialog
          open={open}
          disableRestoreFocus={true}
          onClose={this.handleClose}
          className={'modal'}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className={'modal-title'}>
            <FilterListIcon className={'icon mr-3'}/>
            Filter Transactions
          </DialogTitle>
          <DialogContent className={'modal-content'}>
            <DialogContentText>
              Filterrrr
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <div className={'flex'}>
              <Button onClick={this.handleClose} color="secondary">
                Clear
              </Button>
            </div>
            <Button onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={this.doFilter} color="primary" autoFocus>
              Filter
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  }
}

export default TransactionFilter

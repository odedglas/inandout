import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FilterListIcon from '@material-ui/icons/FilterList';
import util from '@util/'
import FilterRow from './FilterRow';

class TransactionFilter extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    filter: PropTypes.arrayOf(PropTypes.object),
    hideFilter: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
  };

  state = {
    filterValues: []
  };

  componentDidUpdate(prevProps) {

    let open = this.props.open === true;

    if (open !== prevProps.open) {
      this.resetValues();
    }
  }

  resetValues = () => {

    const filterValues = this.props.filter.reduce((values, lf) => {
      !util.isEmptyObject(lf.value) && values.push({...lf.value});
      return values;
    }, []);

    this.setState({filterValues});
  };

  handleClose = () => {
    this.props.hideFilter();
  };

  doFilter = () => {

    this.props.handleFilterChange(
      this.state.filterValues
    );

    this.handleClose()
  };

  addFilterRow = filterRow => {

    this.setState({
      filterValues: [
        ...this.state.filterValues,
        filterRow
      ]
    });
  };

  editFilterRow = filterRow => {

    this.setState({
      filterValues: util.updateById(this.state.filterValues, filterRow, 'filterId')
    })
  };

  removeFilterRow = filterRow => {

    const {filterValues} = this.state;

    this.setState({
      filterValues: filterValues.filter(f => f.filterId !== filterRow.filterId)
    });

  };

  clearFilter = () => {

    this.props.handleFilterChange(
      []
    );

    this.handleClose()
  };

  render() {

    const {open, filter} = this.props;
    const {filterValues} = this.state;

    return (
      <div>
        <Dialog
          open={open}
          disableRestoreFocus={true}
          onClose={this.handleClose}
          fullWidth
          className={'modal filter'}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle className={'modal-title'}>
            <FilterListIcon className={'icon mr-3'}/>
            Filter Transactions
          </DialogTitle>
          <DialogContent className={'modal-content'}>

            {
              filterValues.map((value, i) => {
                return <FilterRow key={`${value.filterId}_${i}`}
                                  removeFilterRow={this.removeFilterRow}
                                  editFilterRow={this.editFilterRow}
                                  filter={filter} filterRow={value}/>
              })
            }

            <FilterRow filter={filter}
                       key={'add-filter-row'}
                       addFilterRow={this.addFilterRow}/>

          </DialogContent>
          <DialogActions>
            <div className={'flex'}>
              <Button onClick={this.clearFilter} color="secondary">
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

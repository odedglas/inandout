import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FilterListIcon from '@material-ui/icons/FilterList';
import Grow from '@material-ui/core/Grow';
import Slide from '@material-ui/core/Slide';
import util from '@util/'
import FilterRow from '../dashboard/project/transactions/filter/FilterRow';

function SliderTransition(props) {
  return <Slide direction="up" {...props} />;
}

class TransactionFilter extends Component {

  static propTypes = {
    open: PropTypes.bool.isRequired,
    filter: PropTypes.arrayOf(PropTypes.object),
    filterValues: PropTypes.arrayOf(PropTypes.object),
    hideFilter: PropTypes.func.isRequired,
    handleFilterChange: PropTypes.func.isRequired,
    categories: PropTypes.array,
    customers: PropTypes.array,
    projectMemberKeys: PropTypes.array,
    dashboardUsers: PropTypes.array,
  };

  state = {
    filterValues: [],
    projectMembers: []
  };

  constructor(props) {
    super(props);

    this.addFilterRowRef = React.createRef();
    this.editFilterRowsRef = []
  }

  componentDidUpdate(prevProps) {

    const { projectMemberKeys, dashboardUsers } = this.props;

    let open = this.props.open === true;

    if (open !== prevProps.open) {
      const projectMembers = dashboardUsers.filter(u => projectMemberKeys.indexOf(u.id) !== -1);
      this.setState({projectMembers});
      this.setFilterValues();
    }
  }

  componentWillUnmount() {
    this.editFilterRowsRef = [];
  }

  setFilterValues = () => {

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

    //Validate edited filters
    const valid = this.editFilterRowsRef.every(ref => ref.isRowValid());

    //Continue to change if valid
    if(valid) {

      let filterValues = this.state.filterValues;

      //Updating filter values by latest edited rows
      this.editFilterRowsRef.forEach(ref => {
        filterValues = util.updateById(filterValues, ref.state, 'filterId')
      });

      //Pushing addFilterRowRef value if valid
      if(this.addFilterRowRef.isRowValid(true)) {
        filterValues.push(this.addFilterRowRef.state)
      }

      this.props.handleFilterChange(
        filterValues
      );

      this.handleClose()
    }
  };

  addFilterRow = filterRow => {

    this.setState({
      filterValues: [
        ...this.state.filterValues,
        filterRow
      ]
    });
    this.editFilterRowsRef = [];
  };

  editFilterRow = filterRow => {

    this.setState({
      filterValues: util.updateById(this.state.filterValues, filterRow, 'filterId')
    })
  };

  registerOrUpdateFilterRowRef = filterRowRef => {

    const existingRef = this.editFilterRowsRef.find(ref => ref.state.filterId === filterRowRef.state.filterId);

    if(!existingRef) {
      this.editFilterRowsRef.push(filterRowRef)
    }
    else {

      this.editFilterRowsRef = util.updateById(this.editFilterRowsRef, filterRowRef, (ref) => ref.state.filterId)
    }
  };

  removeFilterRow = filterRow => {

    const {filterValues} = this.state;

    this.setState({
      filterValues: filterValues.filter(f => f.filterId !== filterRow.filterId),
    });

    this.editFilterRowsRef = this.editFilterRowsRef.filter(ref => ref.state.filterId !== filterRow.filterId);

  };

  clearFilter = () => {

    this.props.handleFilterChange(
      []
    );

    this.handleClose()
  };

  render() {

    const {open, filter, categories, customers} = this.props;
    const {filterValues, projectMembers} = this.state;

    const mobile = util.isMobile();

    return (
      <div>
        <Dialog
          open={open}
          fullScreen={mobile}
          TransitionComponent={mobile ? SliderTransition : Grow}
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
                                  ref={(ref) => {

                                    const filterRowRef = ref && ref.validationComponentRef.current;

                                    filterRowRef && this.registerOrUpdateFilterRowRef(filterRowRef)
                                  }}
                                  removeFilterRow={this.removeFilterRow}
                                  categories={categories}
                                  customers={customers}
                                  members={projectMembers}
                                  editFilterRow={this.editFilterRow}
                                  filter={filter} filterRow={value}/>
              })
            }

            <FilterRow filter={filter}
                       key={'add-filter-row'}
                       filterValues={filterValues}
                       categories={categories}
                       customers={customers}
                       members={projectMembers}
                       ref={(ref) => {

                         const filterRowRef = ref && ref.validationComponentRef.current;

                         if(filterRowRef){
                           this.addFilterRowRef = filterRowRef;
                         }
                       }}
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

export default connect(state => ({
  projectMemberKeys: state.project.members,
  dashboardUsers: state.dashboard.users,
  categories: state.project.categories,
  customers: state.project.customers,
}), {})(TransactionFilter);

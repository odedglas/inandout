import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

class TransactionTableViewHeader extends Component {

  static propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    projectCurrency: PropTypes.string,
    orderBy: PropTypes.object.isRequired
  };

  createSortHandler = column => event => {
    this.props.onRequestSort(event, {
      id: column.id,
      prop: column.orderByProp ? column.orderByProp : column.id
    });
  };

  render() {
    const {order, orderBy, projectCurrency} = this.props;

    const columnData = [
      {id: 'actions', sortable: false, additionalCls: 'action-cell'},
      {id: 'date', label: 'Date'},
      {id: 'owner', label: 'Owner', avatar: true, orderByProp: 'owner.displayName'},
      {id: 'description', label: 'Description', colspan: 2, additionalCls: 'px-3',},
      {id: 'amount', numeric: true, label: `Amount (${projectCurrency})`},
      {id: 'type', label: 'Type', additionalCls: 'small-cell', orderByProp: 'income'},
      {id: 'payments', label: 'Payments'},
      {id: 'customer', label: 'Customer', avatar: true,},
      {id: 'category', label: 'Category', avatar: true, orderByProp: 'category.name'},
    ];

    return (
      <TableHead>
        <TableRow>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                colSpan={column.colspan ? column.colspan : 1}
                className={`${column.additionalCls ? column.additionalCls : ''} ${column.avatar ? 'avatar-header' :
                  ''}`}
                sortDirection={orderBy.id === column.id ? order : false}
              >
                {
                  column.sortable !== false ? <TableSortLabel
                    active={orderBy.id === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column)}
                  >
                    {column.label}
                  </TableSortLabel> : <div> {column.label} </div>
                }

              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

export default TransactionTableViewHeader;
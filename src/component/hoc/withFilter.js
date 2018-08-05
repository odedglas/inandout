import React from 'react';
import filterUtil from '@util/filter';
import {
  withRouter
} from 'react-router-dom';

const withFilter = (filterDefinition) => (Component) => {

  class WithFilter extends React.Component {

    constructor(props) {
      super(props);

      const filter = filterUtil.createFilter(filterDefinition);
      const initialFilter = props.location.state && props.location.state.initialFilter;

      if(initialFilter) {

        this.state = this.generateFilterState(initialFilter, filter);
      }
      else {
        this.state = {
          filter,
          filterFN: () => true
        };

      }
    }

    handleFilterChange = (filterValues) => {

      this.setState(this.generateFilterState(filterValues, this.state.filter));
    };

    generateFilterState = (filterValues, filter) => {

      const filterValuesMap = filterValues.reduce((map, value) => {

        map[value.filterId] = value;
        return map;
      }, {});

      const _filter = filter.map(f => {

        const value = filterValuesMap[f.id] || {};
        return {
          ...f,
          value
        }
      });

      const activeFilters = _filter.filter(f => filterValues.find(fv => fv.filterId === f.id));

      const filterFN = data => activeFilters.every(filter => {

        const filterValueEntry = filter.value;
        const operatorWrapper = filter.operators.find(o => o.key === filterValueEntry.operator);

        //The get Field value access method
        const getDataFieldValue = (data) => {
          if(filter.getFieldValue) return filter.getFieldValue(data);
          return data[filter.id];
        };

        return operatorWrapper.operator(getDataFieldValue(data), filterValueEntry.value);
      });

      return {filter: _filter, filterFN}
    };

    handleDoFilter = (data) => {

      return this.state.filterFN(data);
    };

    render() {

      const { filter } = this.state;

      return (
        <Component {...this.props}
                   handleFilterChange={this.handleFilterChange}
                   doFilter={this.handleDoFilter}
                   filter={filter}/>
      );
    }
  }
  return withRouter(WithFilter);
};

export default withFilter;


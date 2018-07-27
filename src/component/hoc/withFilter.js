import React from 'react';
import filterUtil from '@util/filter';

const withFilter = (filterDefinition) => (Component) => {

  class WithFilter extends React.Component {

    constructor(props) {
      super(props);

      const filter = filterUtil.createFilter(filterDefinition);

      this.state = {
        filter,
        filterFN: () => true
      };
    }

    handleFilterChange = (filterValues) => {

      const filterValuesMap = filterValues.reduce((map, value) => {

        map[value.filterId] = value;
        return map;
      }, {});

      const filter = this.state.filter.map(f => {

        const value = filterValuesMap[f.id] || {};
        return {
          ...f,
          value
        }
      });

      const activeFilters = filter.filter(f => filterValues.find(fv => fv.filterId === f.id));

      const filterFN = data => activeFilters.every(filter => {

        const filterValueEntry = filter.value;
        const operatorWrapper = filter.operators.find(o => o.key === filterValueEntry.operator);

        return operatorWrapper.operator(data[filter.id], filterValueEntry.value);
      });

      this.setState({filter, filterFN});
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
  return WithFilter;
};

export default withFilter;


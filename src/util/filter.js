import dateUtil from '@util/date';

const FILTER_TYPES = {
  'number': {
    operators: [
      {
        key: 'gt',
        mmark: '>',
        label: 'Greater than',
        operator: (v1, v2) => v1 > v2
      },
      {
        key: 'lt',
        mark: '<',
        label: 'Lower than',
        operator: (v1, v2) => v1 < v2
      },
      {
        key: 'gte',
        mark: '>=',
        label: 'Greater equals than',
        operator: (v1, v2) => v1 >= v2
      },
      {
        key: 'lte',
        mark: '<=',
        label: 'Lower equals than',
        operator: (v1, v2) => v1 <= v2
      },
      {
        key: 'e',
        mark: '=',
        label: 'Equals',
        operator: (v1, v2) => v1 === v2
      },
      {
        key: 'ne',
        mark: '!=',
        label: 'Not equals',
        operator: (v1, v2) => v1 !== v2
      },
    ]
  },
  'string': {
    operators: [
      {
        key:'e',
        label: 'Equals',
        operator: (v1, v2) => v1 === v2
      },
      {
        key: 'ne',
        label: 'Not equals',
        operator: (v1, v2) => v1 !== v2
      },
      {
        key: 'contains',
        label: 'Contains',
        operator: (v1, v2) => v1 && v1.includes(v2)
      },
      {
        key: 'sw',
        label: 'Starts with',
        operator: (v1, v2) => v1 && v1.startsWith(v2)
      },
      {
        key: 'ew',
        label: 'Ends with',
        operator: (v1, v2) => v1 && v1.endsWith(v2)
      },
    ]
  },
  'date': {
    operators: [
      {
        key: 'after',
        label: 'After',
        operator: (v1, v2) => dateUtil.isAfter(v1,v2)
      },
      {
        key: 'before',
        label: 'Before',
        operator: (v1, v2) => dateUtil.isBefore(v1,v2)
      },
    ]
  },
  'select': {
    operators: [
      {
        key: 'in',
        label: 'In',
        operator: (v1, v2) => v1.indexOf(v2) !== -1
      },
      {
        key: 'nin',
        label: 'Not in',
        operator: (v1, v2) => v1.indexOf(v2) === -1
      },
    ]
  }
};

export default {

  createFilter(filterDefinition) {

    return filterDefinition.map(fd => ({
      ...fd,
      value: {},
      operators: FILTER_TYPES[fd.type].operators
    }))

  }
}
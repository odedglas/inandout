import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withValidation from '@hoc/withValidation';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import DynamicIcon from "../../../../common/DynamicIcon";
import DatePicker from 'material-ui-pickers/DatePicker';
import util from '@util/'

const initialState = {
  filterId: '',
  operator: '',
  value: ''
};

class FilterRow extends Component {

  static propTypes = {
    filter: PropTypes.array,
    filterRow: PropTypes.object,
    addFilterRow: PropTypes.func,
    editFilterRow: PropTypes.func,
    removeFilterRow: PropTypes.func,
    isValid: PropTypes.func.isRequired,
    validate: PropTypes.func.isRequired,
    clearValidation: PropTypes.func.isRequired,
    onValidationChange: PropTypes.func.isRequired,
    validation: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    const existing = this.props.filterRow;
    const existingRow = existing && !util.isEmptyObject(existing);

    //State will be set to existing row OR initial state
    this.state = {
      ...(existingRow ? existing : initialState),
      existingRow
    }
  }

  handleFieldChange = (field, val) => {

    let update = {};
    update[field] = val;

    if (field === 'filterId') {
      //Cleaning current operator
      update.operator = '';
    }

    this.props.onValidationChange({...this.state}, update, field);
    this.setState(update);

  };

  isRowValid = () => {

    const {validate} = this.props;
    const validationModel = {...this.state};

    const validationResult = validate(validationModel);
    return validationResult.isValid
  };

  onFilterAdd = () => {

    const validationModel = {...this.state};

    if (this.isRowValid()) {

      //Adding filter
      this.props.addFilterRow(validationModel);
      this.setState({...initialState})
    }

  };

  onFilterRemove = () => {

    this.props.removeFilterRow(this.props.filterRow);
  };

  getValueControl = (selectedFilter, value, validation) => {

    const type = selectedFilter ? selectedFilter.type : '';

    switch (type) {

      case 'date' : {
        return (
          <DatePicker
            value={value || new Date()}
            error={validation.value.isInvalid}
            title={validation.value.message}
            label="Value"
            style={{maxWidth:'100%'}}
            onChange={(date) => {
              this.handleFieldChange('value', date.toDate().getTime())
            }}
          />
        );
      }
      default: {

        return (
          <TextField
            value={value}
            fullWidth
            onChange={(e) => this.handleFieldChange('value', e.target.value)}
            error={validation.value.isInvalid}
            title={validation.value.message}
            label="Value"
          />
        )
      }
    }
  };

  render() {

    const {filter, filterRow, validation} = this.props;
    const {filterId, operator, value} = this.state;

    const isNewRow = !filterRow || util.isEmptyObject(filterRow);
    const selectedFilter = filter.find(f => f.id === filterId);

    return (
      <div className={'row'}>

        <div className={'col-sm-12'}>

        </div>

        <div className={'col-sm-12 px-0 row'}>

          <div className={'col-sm-4'}>
            <TextField
              select={isNewRow}
              fullWidth
              label={isNewRow ? 'Choose filter' : 'Filed'}
              disabled={!isNewRow}
              inputProps={{className:'capitalize'}}
              error={validation.filterId.isInvalid}
              title={validation.filterId.message}
              onChange={(e) => this.handleFieldChange('filterId', e.target.value)}
              value={filterId}
            >
              {filter.map(f => (
                <MenuItem key={f.id} value={f.id}>
                  {f.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className={'col-sm-3'}>
            <TextField
              select
              fullWidth
              label="Operator"
              error={validation.operator.isInvalid}
              title={validation.operator.message}
              disabled={!selectedFilter}
              onChange={(e) => this.handleFieldChange('operator', e.target.value)}
              SelectProps={{
                renderValue: selected => {
                  let operator = selectedFilter.operators.find(o => o.key === selected);
                  return (
                    operator ? <div>{operator.mark || operator.label}</div> : ''
                  )
                }
              }}
              value={operator}
            >
              {
                selectedFilter ? selectedFilter.operators.map(o => (
                  <MenuItem key={o.key} value={o.key}>
                    {o.label}
                  </MenuItem>
                )) : <MenuItem key={'empty-item'} value={''}/>}
            </TextField>
          </div>
          <div className={'col-sm-3'}>
            { this.getValueControl(selectedFilter, value, validation)}
          </div>
          <div className={'col-sm-2 px-0'}>
            {isNewRow ?
              <IconButton className={'add-filter'} onClick={this.onFilterAdd}>
                <DynamicIcon name={'add'}/>
              </IconButton> :
              <IconButton className={'remove-filter'} onClick={this.onFilterRemove}>
                <DynamicIcon name={'close'}/>
              </IconButton>
            }
          </div>
        </div>

      </div>

    )
  }
}

export default withValidation([
  {
    field: 'filterId',
    method: (v, f, state, validator, args) => !validator.isEmpty(v),
    message: 'Please choose filter field.'
  },
  {
    field: 'operator',
    method: (v, f, state, validator, args) => !validator.isEmpty(v),
    message: 'Please choose operator'
  },
  {
    field: 'value',
    method: (v, f, state, validator, args) => !validator.isEmpty(''+v),
    message: 'Please peak filter value'
  },
])(FilterRow)

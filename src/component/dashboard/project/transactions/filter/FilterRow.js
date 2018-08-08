import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withValidation from '@hoc/withValidation';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import DynamicIcon from "../../../../common/DynamicIcon";
import DatePicker from 'material-ui-pickers/DatePicker';
import util from '@util/'
import {TRANSACTIONS_TYPE} from '@const/';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AvatarSelect from '@common/AvatarSelect';
import UserAvatar from '@common/UserAvatar';

const initialState = {
  filterId: '',
  operator: '',
  value: ''
};

class FilterRow extends Component {

  static propTypes = {
    categories: PropTypes.array,
    customers: PropTypes.array,
    members: PropTypes.array,
    filter: PropTypes.array,
    filterValues: PropTypes.array,
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
      update.value = '';
    }

    this.props.onValidationChange({...this.state}, update, field);
    this.setState(update);
  };

  isRowValid = (silent) => {

    const {validate} = this.props;
    const validationModel = {...this.state};

    const validationResult = validate(validationModel, undefined, silent);
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

    const {categories , customers, members} = this.props;

    const type = selectedFilter ? selectedFilter.type : '';

    switch (type) {

      case 'date' : {
        return (
          <DatePicker
            value={value || null}
            autoOk
            error={validation.value.isInvalid}
            title={validation.value.message}
            label="Value"
            style={{maxWidth: '100%'}}
            onChange={(date) => {
              this.handleFieldChange('value', date.toDate().getTime())
            }}
          />
        );
      }
      case 'singleSelect' : {

        const filterId = selectedFilter.id;

        if (filterId === 'type') return (
          <TextField
            select
            fullWidth
            label="Value"
            error={validation.value.isInvalid}
            title={validation.value.message}
            value={value}
            onChange={(e) => this.handleFieldChange('value', e.target.value)}
          >
            {TRANSACTIONS_TYPE.map(option => (
              <MenuItem key={option.key} value={option.key}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );

        return null;
      }

      case 'select' : {

        const filterId = selectedFilter.id;

        if (filterId === 'category') return (

          <AvatarSelect selected={value || []}
                        label="Value"
                        error={validation.value.isInvalid}
                        multi={true}
                        rawData={categories}
                        filterData={(c) => !c.excluded}
                        renderAvatar={(item) => (
                          <Avatar className={'avatar smallest mr-1'}
                                  key={item.id}
                                  style={{'backgroundColor': item.color}}>
                            <DynamicIcon className={'icon white'} name={item.icon}/>
                          </Avatar>
                        )}
                        renderListItem={(item) => (
                          <MenuItem
                            key={item.id}
                            value={item.id}>
                            <ListItemIcon className={'menu-icon'}>
                              <Avatar className={'avatar small'} style={{'backgroundColor': item.color}}>
                                <DynamicIcon className={'icon white'} name={item.icon}/>
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText className={'menu-text'}
                                          primary={item.name}/>
                          </MenuItem>
                        )}
                        onChange={(val) => this.handleFieldChange('value', val)}/>
        );

        else if (filterId === 'customer') return (

          <AvatarSelect selected={value || []}
                        label="Value"
                        error={validation.value.isInvalid}
                        multi={true}
                        rawData={customers}
                        renderAvatar={(item) => (
                          <UserAvatar user={item}
                                      key={item.id}
                                      size={'smallest'}
                                      className={'white mr-1'}/>
                        )}
                        renderListItem={(item) => (
                          <MenuItem
                            key={item.id}
                            value={item.id}>
                            <ListItemIcon className={'menu-icon'}>
                              <UserAvatar user={item}
                                          size={'small'}
                                          className={'white'}/>
                            </ListItemIcon>
                            <ListItemText className={'menu-text'}
                                          primary={item.name}/>
                          </MenuItem>
                        )}
                        onChange={(val) => this.handleFieldChange('value', val)}/>
        );

        else if (filterId === 'owner') return (

          <AvatarSelect selected={value || []}
                        label="Value"
                        error={validation.value.isInvalid}
                        multi={true}
                        rawData={members}
                        renderAvatar={(item) => (
                          <UserAvatar user={item}
                                      key={item.id}
                                      size={'smallest'}
                                      className={'white mr-1'}/>
                        )}
                        renderListItem={(item) => (
                          <MenuItem
                            key={item.id}
                            value={item.id}>
                            <ListItemIcon className={'menu-icon'}>
                              <UserAvatar user={item}
                                          size={'small'}
                                          className={'white'}/>
                            </ListItemIcon>
                            <ListItemText className={'menu-text'}
                                          primary={item.displayName}/>
                          </MenuItem>
                        )}
                        onChange={(val) => this.handleFieldChange('value', val)}/>
        );

        return null;
      }
      default: {

        return (
          <TextField
            value={value}
            type={type === 'number' ? 'number' : 'text'}
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

    const {filter, filterValues, filterRow, validation} = this.props;
    const {filterId, operator, value} = this.state;

    const isNewRow = !filterRow || util.isEmptyObject(filterRow);
    const selectedFilter = filter.find(f => f.id === filterId);

    const excludedFilters = filterValues ? filterValues.map(fv => fv.filterId) : [];

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
              inputProps={{className: 'capitalize'}}
              error={validation.filterId.isInvalid}
              title={validation.filterId.message}
              onChange={(e) => this.handleFieldChange('filterId', e.target.value)}
              value={filterId}
            >
              {filter.filter(f => excludedFilters.indexOf(f.id) === -1).map(f => (
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
          <div className={'col-sm-4'}>
            {this.getValueControl(selectedFilter, value, validation)}
          </div>
          <div className={'col-sm-1 px-0'}>
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
    method: (v, f, state, validator, args) => !validator.isEmpty('' + v),
    message: 'Please peak filter value'
  },
])(FilterRow)

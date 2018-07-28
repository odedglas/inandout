import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const MenuProps = {
  PaperProps: {
    style: {
      transform: 'translate3d(0, 0, 0)',
      maxHeight: 300,
      width: 250,
    },
  },
};

class AvatarSelect extends Component {

  static propTypes = {
    selected: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string
    ]),
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    title: PropTypes.string,
    error: PropTypes.bool,
    rawData: PropTypes.array,
    filterData: PropTypes.func,
    multi: PropTypes.bool.isRequired,
    renderAvatar: PropTypes.func.isRequired,
    renderListItem: PropTypes.func.isRequired
  };

  state = {
    open: false,
    data:[]
  };

  static getDerivedStateFromProps(props, state) {

    const rawData = props.rawData || [];
    const hasFilterFN = typeof props.filterData === 'function';
    return {
      data: hasFilterFN ?rawData.filter(props.filterData) : rawData
    }
  }

  handleClose = () => {
    this.setState({open: false});
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  render() {

    const {
      selected,
      onChange,
      error,
      multi,
      label,
      renderAvatar,
      renderListItem,
    } = this.props;

    const {data} = this.state;

    return (
      <FormControl className={'avatar-select w-100'} error={error}>
        <InputLabel htmlFor="select-multiple-avatar">{label}</InputLabel>
        <Select
          multiple={multi}
          open={this.state.open}
          onClose={this.handleClose}
          onOpen={this.handleOpen}
          value={selected}
          onChange={(event) => onChange(event.target.value)}
          input={<Input className={'w-100'} id="select-multiple-avatar"/>}
          renderValue={selected => (
            <div style={{'whiteSpace': 'initial', 'display': 'flex'}}>
              {
                selected.map((value, i) => {

                const valueWrapper = data.find(c => c.id === value);
                return valueWrapper ? renderAvatar(valueWrapper) : null;
              })}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {data.length > 0 ? data.map(item => renderListItem(item)) : <div> No items to choose from</div>}

        </Select>

      </FormControl>
    )
  }
}

export default AvatarSelect;


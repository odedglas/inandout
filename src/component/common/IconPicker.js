import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PopoverPicker from './PopoverPicker';
import DynamicIcon from '@common/DynamicIcon';

export class ColorPicker extends Component {

  state = {
    icons: [
      'gift',
      'games',
      'music',
      'toys',
      'creation',
      'flower',
      'movie',
      'outdoor',
      'kitchen',
      'sea',
      'hot',
      'cake',
      'coffee',
      'global',
      'gas',
      'flight',
      'addShop',
      'assignment',
      'build',
      'favorite',
      'print',
      'electricity',
      'security',
      'work',
    ]
  };

  static propTypes = {
    selectedIcon: PropTypes.string,
    onChange: PropTypes.func,
  };

  handleIconClick = color => {
    this.props.onChange(color);
  };

  render() {

    const {selectedIcon} = this.props;
    const {icons} = this.state;

    return (
      <PopoverPicker
        itemClick={this.handleIconClick}
        selectedValue={selectedIcon}
        target={(selectedIcon) => (
          <span className={'value icon-picker-target icon'}>
               <DynamicIcon name={selectedIcon}/>
           </span>
        )}
        content={(selectedIcon, itemClick) => (
          <div className={'icon-picker popover-picker'}>
            {
              icons.map(icon => {

                return (
                  <div className={'icon'}
                       key={icon}
                       onClick={() => itemClick(icon)}>
                    <DynamicIcon name={icon}/>
                  </div>
                )
              })
            }
          </div>
        )}
      />
    )
  }
}

export default ColorPicker;
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PopoverPicker from './PopoverPicker';
import themeService from '@service/theme'

export class ColorPicker extends Component {

  state = {
    colors: themeService.getPalette(600).concat(['#424242'])
  };

  static propTypes = {
    selectedColor: PropTypes.string,
    onChange: PropTypes.func,
    beforeShow: PropTypes.func,
    beforeHide: PropTypes.func
  };

  handleColorClick = color => {
    this.props.onChange(color);
  };

  render() {

    const {selectedColor, beforeHide, beforeShow} = this.props;
    const {colors} = this.state;

    return (
      <PopoverPicker
        itemClick={this.handleColorClick}
        selectedValue={selectedColor}
        beforeShow={beforeShow}
        beforeHide={beforeHide}
        target={(selectedColor) => {

          return (
            this.props.children ? this.props.children :
              <span className={'value color-picker-target'}
                    style={{backgroundColor: selectedColor, color: selectedColor}}>
            </span>
          )
        }}
        content={(selectedColor, itemClick) => (
          <div className={'color-picker popover-picker'}>
            {
              colors.map(color => {
                const colorStyle = {backgroundColor: color, color: color};
                return (
                  <div className={`color ${color === selectedColor ? 'selected' : ''}`}
                       key={color}
                       style={colorStyle}
                       onClick={() => itemClick(color)}>
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
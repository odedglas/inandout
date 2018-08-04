import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Popover from '@material-ui/core/Popover';

export class PopoverPicker extends Component {

  state = {
    targetRef: undefined,
  };

  static propTypes = {
    selectedValue: PropTypes.string,
    itemClick: PropTypes.func,
    target: PropTypes.func.isRequired,
    content: PropTypes.func.isRequired,
    beforeShow: PropTypes.func,
    beforeHide: PropTypes.func
  };

  handleItemClick = val => {
    this.props.itemClick(val);
    this.handleClose();
  };

  handleClose = () => {
    this.props.beforeHide && this.props.beforeHide();
    this.setState({targetRef: undefined});
  };

  handleShow = target => {
    this.props.beforeShow && this.props.beforeShow();
    this.setState({targetRef: target});
  };

  render() {

    const {selectedValue, target, content} = this.props;
    const {targetRef} = this.state;

    return (
      <div className={'flex-center'}>
        <div className={'just-c flex'} onClick={(e) => this.handleShow(e.currentTarget)}>
          {target(selectedValue)}
        </div>
        <Popover
          open={Boolean(targetRef)}
          anchorEl={targetRef}
          onClose={this.handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {content(selectedValue, this.handleItemClick)}
        </Popover>
      </div>
    )
  }
}

export default PopoverPicker;
import React, {Component} from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

export class LoadingMask extends Component {

  render() {
    const { loading } = this.props;

    return (
      <div className={'loading-mask-container'}>
        <div className={'loading-mask'}>
          <CSSTransition
            in={loading}
            timeout={300}
            classNames="fade"
            unmountOnExit
          >
            <div className={'loader'}>
            </div>
          </CSSTransition>
        </div>
        {this.props.children}
      </div>
    )
  }
}


LoadingMask.propTypes = {
  loading: PropTypes.bool.isRequired,
  children: PropTypes.any
};

export default LoadingMask;
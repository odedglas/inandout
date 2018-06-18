import React, {Component} from 'react';
import { CSSTransition } from 'react-transition-group';
import PropTypes from 'prop-types';

export class LoadingMask extends Component {

  render() {
    const { loading } = this.props;
    const loadClassList = `loading-mask ${loading ? 'active' : ''}`;
    return (
      <div className={'loading-mask-container h-100 w-100'}>
        <CSSTransition
          in={loading}
          timeout={300}
          classNames="fade"
          unmountOnExit
        >
          <div className={loadClassList}>
            <div className={'loader'}>
            </div>
          </div>
        </CSSTransition>
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
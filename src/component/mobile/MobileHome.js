import React from 'react';
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import {CSSTransition} from 'react-transition-group';
import CircularProgress from '@material-ui/core/CircularProgress';
import MobileView from './tabs/MobileView';
import ProjectProvider from '../dashboard/project/ProjectContext';

class MobileHome extends React.Component {

  render() {

    const {loading} = this.props;

    return (
      <ProjectProvider>
        <div className={'mobile-container content scrollable'}>

          <div className="flex-center project-loader" style={{position: 'absolute'}}>
            <CSSTransition
              in={loading}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <CircularProgress size={50}/>
            </CSSTransition>
          </div>
          {
            !loading && <MobileView/>
          }
        </div>
      </ProjectProvider>
    )
  }
}

export default compose(
  withRouter,
  connect(state => ({
    loading: state.dashboard.loading,
  }), {})
)(MobileHome);

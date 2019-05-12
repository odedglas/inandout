import React from 'react';
import {
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';
import {CSSTransition} from 'react-transition-group';
import CircularProgress from '@material-ui/core/CircularProgress';
import MobileView from './tabs/MobileView';
import MobileLanding from './MobileLanding';
import ProjectProvider from '../dashboard/project/ProjectContext';

class MobileHome extends React.Component {

  render() {

    const {projects, loading} = this.props;

    const hasProjects = projects.length > 0;

    return (
      <ProjectProvider>
        <div className={'mobile-container content'}>

          <div className="flex-center mobile-loader">
            <CSSTransition
              in={loading}
              timeout={300}
              classNames="fade"
              unmountOnExit
            >
              <CircularProgress size={50}/>
            </CSSTransition>
          </div>

          {!loading && hasProjects && <MobileView/>}
          {!loading && !hasProjects && <MobileLanding/>}
        </div>
      </ProjectProvider>
    )
  }
}

export default compose(
  withRouter,
  connect(state => ({
    loading: state.dashboard.loading,
    projects: state.projects,
  }), {})
)(MobileHome);

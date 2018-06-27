import React from 'react';
import PropTypes from 'prop-types';
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom';
import {connect} from 'react-redux';
import {compose} from 'recompose';

import CircularProgress from '@material-ui/core/CircularProgress';

import Budgets from './budgets/Budgets';
import ProjectCalendar from './calendar/ProjectCalendar';
import Categories from './categories/Categories';
import Customers from './customers/Customers';
import Todos from './todo/Todos';
import Transactions from './transactions/Transactions';

import {ROUTER as routes} from '@const/';
import { selectProject } from "@action/project";
import projectService from '@service/project';

class ProjectHome extends React.Component {

  static propTypes = {
    selectedProject: PropTypes.object
  };

  state = {
    loadedProject: {},
    loading: false,
  };

  componentWillMount() {

    const { selectedProject, match } = this.props;

    if(!selectedProject) {

      this.setState({ loading: true });
      projectService.fetchProject(match.params.identifier).then(project => {

        this.props.selectProject(project);
        this.setState({ loadedProject: project, loading: false})
      });
    }
  }

  render() {

    const { selectedProject } = this.props;
    const { loadedProject, loading } = this.state;

    const _project = selectedProject || loadedProject;
    return (
      <div className={'scrollable'}>
        { loading ? <CircularProgress size={50}/> : null}
        I R PROJECT HOME DUDE!!!
        Display for KEY -> { _project.id }

        <Switch>
          <Route exact path={routes.BUDGETS}
                 component={Budgets}/>

          <Route exact path={routes.TRANSACTIONS}
                 component={Transactions}/>

          <Route exact path={routes.CATEGORIES}
                 component={Categories}/>

          <Route exact path={routes.CUSTOMERS}
                 component={Customers}/>

          <Route exact path={routes.PROJECT_CALENDAR}
                 component={ProjectCalendar}/>

          <Route exact path={routes.TODOS}
                 component={Todos}/>

        </Switch>
      </div>
    );
  }
}

export default compose(
  withRouter,
  connect( state => ({
    selectedProject: state.project.selectedProject,
  }), {selectProject})
)(ProjectHome);

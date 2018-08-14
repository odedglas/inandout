import React, {Component} from 'react';
import {connect} from 'react-redux';
import PageTitle from "@common/PageTitle";
import Breadcrumb from '../breadcrumbs/Breadcrumb';
import Paper from '@material-ui/core/Paper';
import Calendar from './Calendar';
import {ProjectContext} from '../ProjectContext';

class ProjectCalendar extends Component {

  render() {

    return (
      <div className={'calendar-container'}>

        <PageTitle text={'Calendar'} icon={'calendar'}/>

        <Breadcrumb item={{id: 'calendarsCrumb', value: 'Calendar'}}/>
        <ProjectContext.Consumer>
          {(projectContext) => (
            <Paper className={'mx-3 mt-3 p-3'}>
              <Calendar events={projectContext.events}
                        project={projectContext.project}/>
            </Paper>
          )}
        </ProjectContext.Consumer>

      </div>

    );
  }
}

export default connect(null, {})(ProjectCalendar);
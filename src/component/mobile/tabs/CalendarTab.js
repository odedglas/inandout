import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from "@material-ui/core/ButtonBase";

import DynamicIcon from '@common/DynamicIcon';
import CreateBudget from '@modal/CreateBudget'
import Paper from '@material-ui/core/Paper';
import util from '@util/'
import dateUtil from '@util/date'
import budgetService from '@service/budget';
import ProjectCalendar from '../../dashboard/project/calendar/ProjectCalendar';
import {TRANSACTIONS_PAYMENT_METHODS} from '@const/';

import { Calendar } from 'material-ui-pickers';

class CalendarTab extends React.Component {

  render () {

    return (
      <div className={'tab calendar-tab row'}>
Yooo Cale!
        <Paper style={{ overflow: 'hidden', width: '100%' }}>
          <Calendar className={'test'} date={dateUtil.wrap(new Date())}  onChange={() => {}} />
        </Paper>
      </div>
    );
  }


}

export default CalendarTab;
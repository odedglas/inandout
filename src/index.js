import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './component/App';
import store from './store';
import registerServiceWorker from './registerServiceWorker';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import MomentUtils from 'material-ui-pickers/utils/moment-utils';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

// Styles
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import 'react-big-calendar/lib/css/react-big-calendar.css'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'

import themeService from './service/theme'
import './assets/style/imports.scss';

//Calendar localization init
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

//Fire base service init
require('./service/firebase');

//Creating app theme as provider
const theme = createMuiTheme(
  themeService.config
);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <App />
      </MuiPickersUtilsProvider>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root'));

registerServiceWorker();

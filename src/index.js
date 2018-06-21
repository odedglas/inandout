import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import themeService from './service/theme'
import './assets/style/imports.scss';
import App from './component/App';
import store from './store';
import registerServiceWorker from './registerServiceWorker';
require('./service/firebase');

const theme = createMuiTheme(
  themeService.config
);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root'));

registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import './assets/style/theme/theme.css'
import './assets/style/theme/onsen-css-components.css'
import './assets/style/imports.scss';
import App from './component/App';
import store from './store';
import registerServiceWorker from './registerServiceWorker';
require('./service/firebase');
const ons = require('onsenui');
const isMobile = window.matchMedia( "(min-width: 768px)" ).matches;

if(isMobile) {
  ons.platform.select('android')
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();

import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import CssBaseline from '@material-ui/core/CssBaseline';
import { App } from './components';
import * as serviceWorker from './serviceWorker';
import * as config from './config.json';

ReactGA.initialize(config.analytics);
ReactGA.pageview(`${window.location.pathname}${window.location.search}`);

ReactDOM.render(
  <CssBaseline>
    <App />
  </CssBaseline>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

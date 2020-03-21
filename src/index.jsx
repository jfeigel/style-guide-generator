import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { App } from './components';

import * as serviceWorker from './serviceWorker';
import config from './config';

ReactGA.initialize(config.analytics);
ReactGA.pageview(`${window.location.pathname}${window.location.search}`);

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#21ce99',
      contrastText: '#fff'
    },
    secondary: {
      main: '#ce2155'
    }
  }
});

ReactDOM.render(
  <CssBaseline>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </CssBaseline>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

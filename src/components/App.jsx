import React, { useState } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';
import clsx from 'clsx';

import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';

import {
  Account,
  ButtonAppBar,
  Error,
  Home,
  Login,
  PrivateRoute,
  Success
} from '.';
import { AuthContext } from '../contexts';

import './App.css';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#fff',
    height: '100%',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3)
  }
}));

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

/**
 * Main App Component
 *
 * @component
 */
function App() {
  const existingUser =
    (localStorage.getItem('user') &&
      JSON.parse(localStorage.getItem('user'))) ||
    null;
  const [loggedInUser, setLoggedInUser] = useState(existingUser);

  const classes = useStyles();

  const setUser = data => {
    data
      ? localStorage.setItem('user', JSON.stringify(data))
      : localStorage.removeItem('user');
    setLoggedInUser(data);
  };

  return (
    <AuthContext.Provider value={{ loggedInUser, setLoggedInUser: setUser }}>
      <Router history={history}>
        <ButtonAppBar />
        <Container
          component="main"
          className={clsx(classes.container, 'MuiPaper-elevation1')}
        >
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/success/:provider" component={Success} />
            <PrivateRoute path="/account" component={Account} />
            <Route path="*" component={Error} />
          </Switch>
        </Container>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

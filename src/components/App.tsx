import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import ReactGA from 'react-ga';
import clsx from 'clsx';

import { Container } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { createBrowserHistory } from 'history';

import { Account, ButtonAppBar, Error, Home, Login, PrivateRoute } from '.';
import { AuthContext } from '../contexts';

import './App.css';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      backgroundColor: '#fff',
      height: '100%',
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3)
    }
  })
);

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

function App(): JSX.Element {
  const classes = useStyles();

  return (
    <AuthContext.Provider value={false}>
      <Router history={history}>
        <ButtonAppBar />
        <Container className={clsx(classes.container, 'MuiPaper-elevation1')}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <PrivateRoute path="/account" component={Account} />
            <Route path="*" component={Error} />
          </Switch>
        </Container>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

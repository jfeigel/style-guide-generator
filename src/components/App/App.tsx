import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { Account, ButtonAppBar, Error, Home, Login } from '..';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      textAlign: 'center'
    },
    content: {
      margin: theme.spacing(2)
    }
  })
);

function App(): JSX.Element {
  const classes = useStyles();

  return (
    <Router>
      <ButtonAppBar />
      <div className={classes.content}>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="*">
            <Error />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

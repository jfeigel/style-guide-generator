import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';

import { useAuth } from '../contexts';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

/**
 * Custom App Bar Component
 *
 * @component
 */
function ButtonAppBar() {
  const history = useHistory();
  const classes = useStyles();
  const { loggedInUser, setLoggedInUser } = useAuth();

  const logOut = () => {
    setLoggedInUser();
    history.push('/login');
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link
              color="inherit"
              underline="none"
              component={RouterLink}
              to="/"
            >
              Style Guide Generator
            </Link>
          </Typography>
          {!loggedInUser && (
            <Button
              component={RouterLink}
              to="/login"
              color="inherit"
              aria-label="login"
            >
              Login
            </Button>
          )}
          {loggedInUser && (
            <>
              <Button
                component={RouterLink}
                to="/account"
                color="inherit"
                aria-label="account"
              >
                <Avatar
                  alt={loggedInUser.displayName}
                  src={loggedInUser.avatar}
                />
              </Button>
              <Button color="inherit" aria-label="logout" onClick={logOut}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default ButtonAppBar;

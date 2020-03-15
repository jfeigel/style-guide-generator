import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Button,
  IconButton,
  Link,
  Toolbar,
  Typography
} from '@material-ui/core';
import { AccountCircle, Menu } from '@material-ui/icons';

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

function ButtonAppBar() {
  const classes = useStyles();

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
          <Button
            component={RouterLink}
            to="/login"
            color="inherit"
            aria-label="login"
          >
            Login
          </Button>
          <Button
            component={RouterLink}
            to="/account"
            color="inherit"
            aria-label="account"
          >
            <AccountCircle />
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default ButtonAppBar;

import React from 'react';
import PropTypes from 'prop-types';
import { Button, SvgIcon } from '@material-ui/core';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

import { ReactComponent as GoogleIcon } from '../images/google.svg';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#4285f4'
    },
    type: 'light'
  }
});

const useStyles = makeStyles(() => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(1.5, 0),
    height: theme.spacing(4.5),
    justifyContent: 'flex-start',
    width: '100%',
    borderRadius: '2px',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  },
  iconContainer: {
    padding: theme.spacing(1.125),
    backgroundColor: '#fff',
    height: theme.spacing(4.5),
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '2px'
  },
  icon: {
    fontSize: theme.spacing(2.25)
  },
  text: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center'
  }
}));

/**
 * Google Button Component
 *
 * @component
 */
function GoogleButton(props) {
  const classes = useStyles();

  return (
    <Button className={classes.root} variant="contained" href={props.href}>
      <div className={classes.iconContainer}>
        <SvgIcon className={classes.icon} component={GoogleIcon} />
      </div>
      <span className={classes.text}>{props.text}</span>
    </Button>
  );
}

GoogleButton.propTypes = {
  href: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
};

export default GoogleButton;

import React from 'react';

import { SvgIcon } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { ReactComponent as LogoSvg } from '../images/logo.svg';

const useStyles = makeStyles(theme => ({
  root: {
    alignSelf: 'center',
    padding: theme.spacing(2),
    width: theme.spacing(10),
    height: theme.spacing(10),
    backgroundColor: '#21ce99',
    color: '#fff',
    borderRadius: '50%',
    '& > svg': {
      fontSize: theme.spacing(6)
    }
  }
}));

function Logo(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SvgIcon component={LogoSvg} {...props} />
    </div>
  );
}

export default Logo;

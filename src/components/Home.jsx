import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  header: {
    textAlign: 'center'
  }
}));

function Home() {
  const classes = useStyles();

  return <h2 className={classes.header}>Welcome to Style Guide Generator!</h2>;
}

export default Home;

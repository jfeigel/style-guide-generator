import React from 'react';

import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    header: {
      textAlign: 'center'
    }
  })
);

function Home(): JSX.Element {
  const classes = useStyles();

  return <h2 className={classes.header}>Welcome to Style Guide Generator!</h2>;
}

export default Home;

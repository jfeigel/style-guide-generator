import React from 'react';
import { useLocation } from 'react-router-dom';

import { createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() =>
  createStyles({
    title: {
      textAlign: 'center'
    }
  })
);

function Error(): JSX.Element {
  const classes = useStyles();
  const location = useLocation();

  return (
    <div>
      <h2 className={classes.title}>Oh no! An error occurred :X</h2>
      <p>
        Route does not exist: <code>{location.pathname}</code>
      </p>
    </div>
  );
}

export default Error;

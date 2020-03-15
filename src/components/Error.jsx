import React from 'react';
import { useLocation } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  title: {
    textAlign: 'center'
  }
}));

function Error() {
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

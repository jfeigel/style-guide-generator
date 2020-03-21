import React from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  title: {
    textAlign: 'center'
  }
}));

/**
 * Error Component
 *
 * @component
 */
function Error(props) {
  const classes = useStyles();
  const location = useLocation();

  return (
    <div>
      <h2 className={classes.title}>Oh no! An error occurred :X</h2>
      {props.error ? (
        <p>
          Route does not exist: <code>{location.pathname}</code>
        </p>
      ) : (
        <p>{props.error}</p>
      )}
    </div>
  );
}

Error.propTypes = {
  error: PropTypes.string
};

export default Error;

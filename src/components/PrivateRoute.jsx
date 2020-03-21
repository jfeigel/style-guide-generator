import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { useAuth } from '../contexts';

/**
 * Private Route wrapper Component
 *
 * @component
 */
function PrivateRoute({ component: Component, ...rest }) {
  const { loggedInUser } = useAuth();

  return (
    <Route
      {...rest}
      // eslint-disable-next-line no-confusing-arrow
      render={props =>
        loggedInUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { referrer: props.location } }}
          />
        )
      }
    />
  );
}

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  location: PropTypes.object
};

export default PrivateRoute;

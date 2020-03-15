import React, { Component, ComponentType } from 'react';
import { Redirect, Route } from 'react-router-dom';

import { useAuth } from '../contexts';

function PrivateRoute({ component: ComponentType, ...rest }) {
  const isAuthenticated = useAuth();

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}

export default PrivateRoute;

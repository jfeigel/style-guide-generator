import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import { useAuth } from '../contexts';

/**
 * Success Component
 *
 * @component
 */
function Success() {
  const history = useHistory();
  const { setLoggedInUser } = useAuth();
  const axiosApi = axios.create({
    baseURL: 'http://localhost:5000/api/',
    withCredentials: true
  });

  /**
   * Get the logged in User
   *
   * @function
   */
  function getUser() {
    axiosApi
      .get('/user')
      .then(result => {
        setLoggedInUser(result.data);
        history.push('/account');
      })
      .catch(err => history.push('/error', { error: err.message }));
  }

  getUser();

  return <h2>Login Successful!</h2>;
}

export default Success;

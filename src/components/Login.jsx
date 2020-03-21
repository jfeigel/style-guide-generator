/**
 * @module LoginComponent
 */
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Button,
  Collapse,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';

import axios from 'axios';

import Logo from './Logo';
import GoogleButton from './GoogleButton';
import GitHubButton from './GitHubButton';
import { useAuth } from '../contexts';
import useForm from '../hooks/useForm';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(8)
  },
  social: {
    padding: theme.spacing(4, 0, 1),
    margin: 0
  },
  gridContainer: {
    paddingTop: theme.spacing(2)
  },
  dividerContainer: {
    width: '100%',
    position: 'relative',
    '& > span': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      padding: theme.spacing(0, 1.5),
      color: theme.palette.text.hint
    }
  },
  divider: {
    margin: theme.spacing(2, 0),
    width: '100%'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

/**
 * Login Component
 *
 * @component
 */
function Login(props) {
  const classes = useStyles();
  const { loggedInUser, setLoggedInUser } = useAuth();

  const [showPasswordState, setShowPasswordState] = useState(false);
  const [showLoginState, setShowLoginState] = useState(true);
  const [isLoggedInState, setIsLoggedInState] = useState(!!loggedInUser);
  const [errorState, setErrorState] = useState(null);

  const stateSchema = {
    firstName: { value: '', error: '' },
    lastName: { value: '', error: '' },
    email: { value: '', error: '' },
    password: { value: '', error: '' },
    passwordConfirm: { value: '', error: '' }
  };

  const validationStateSchema = {
    firstName: {
      required: !showLoginState,
      validator: {
        regEx: /^[a-zA-Z\s\-']+$/,
        error: 'Invalid First Name'
      }
    },
    lastName: {
      required: !showLoginState,
      validator: {
        regEx: /^[a-zA-Z\s\-']+$/,
        error: 'Invalid Last Name'
      }
    },
    email: {
      required: true,
      validator: {
        regEx: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
        error: 'Invalid Email format'
      }
    },
    password: {
      required: true,
      validator: {
        regEx: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
        error:
          'Password must be at least 8 characters, contain 1 uppercase and 1 lowercase letter, and 1 number'
      }
    },
    passwordConfirm: {
      required: !showLoginState,
      validator: {
        match: 'password',
        error: 'Passwords do not match'
      }
    }
  };

  const {
    state: formState,
    setState: setFormState,
    disable,
    handleOnChange,
    handleOnSubmit
  } = useForm(stateSchema, validationStateSchema, onSubmitForm);

  const axiosAuth = axios.create({
    baseURL: 'http://localhost:5000/auth/',
    withCredentials: true,
    validateStatus: status => status >= 200
  });

  /**
   * Handle toggling a State prop
   *
   * @function
   * @param {string} prop State prop to handle
   * @returns {Function}
   */
  function handleToggleState(prop) {
    return event => {
      event.preventDefault();

      switch (prop) {
        case 'showPassword':
          setShowPasswordState(!showPasswordState);
          break;
        case 'showLogin':
          setShowLoginState(!showLoginState);
          setFormState(stateSchema);
          setShowPasswordState(false);
          break;
        default:
          setErrorState('Invalid state prop found');
      }
    };
  }

  /**
   * Handle MouseDown on button
   *
   * @function
   * @param {MouseEvent} event MouseEvent from 'Show Password' button
   */
  function handleMouseDownAdornment(event) {
    event.preventDefault();
  }

  /**
   * Handle form submission
   *
   * @function
   */
  function onSubmitForm() {
    setErrorState(null);

    const path = showLoginState ? '/login' : '/register';
    let data = {
      email: formState.email.value,
      password: formState.password.value
    };

    if (!showLoginState) {
      data = {
        ...data,
        firstName: formState.firstName.value,
        lastName: formState.lastName.value,
        displayName: `${formState.firstName.value} ${formState.lastName.value}`
      };
    }

    axiosAuth
      .post(path, data)
      .then(result => {
        if (result.status >= 200 && result.status <= 300) {
          setLoggedInUser(result.data);
          setIsLoggedInState(true);
        } else {
          setErrorState(result.data);
        }
      })
      .catch(err => {
        setErrorState(err.message);
      });
  }

  /**
   * Handle closing the snackbar
   *
   * @function
   */
  function handleClose() {
    setErrorState(null);
  }

  const referrer =
    (props.location.state && props.location.state.referrer) || '/account';

  if (isLoggedInState) {
    return <Redirect to={referrer} />;
  }

  return (
    <Container maxWidth="xs">
      <div className={classes.root}>
        <Logo />
        <Grid className={classes.social} container spacing={2}>
          <Grid item md={6}>
            <GoogleButton
              text={showLoginState ? 'Sign in' : 'Sign up'}
              href="http://localhost:5000/auth/google"
            />
          </Grid>
          <Grid item md={6}>
            <GitHubButton
              text={showLoginState ? 'Sign in' : 'Sign up'}
              href="http://localhost:5000/auth/github"
            />
          </Grid>
        </Grid>
        <div className={classes.dividerContainer}>
          <Divider className={classes.divider} />
          <span>OR</span>
        </div>
        <form className={classes.form} noValidate onSubmit={handleOnSubmit}>
          <Collapse in={!showLoginState}>
            <Grid container spacing={2} className={classes.gridContainer}>
              <Grid item sm={6}>
                <TextField
                  autoComplete="fname"
                  id="firstName"
                  name="firstName"
                  label="First Name"
                  type="text"
                  value={formState.firstName.value}
                  variant="outlined"
                  fullWidth
                  margin="none"
                  onChange={handleOnChange}
                  required={!showLoginState}
                  error={!!formState.firstName.error}
                  helperText={formState.firstName.error}
                />
              </Grid>
              <Grid item sm={6}>
                <TextField
                  autoComplete="lname"
                  id="lastName"
                  name="lastName"
                  label="Last Name"
                  type="text"
                  value={formState.lastName.value}
                  variant="outlined"
                  fullWidth
                  margin="none"
                  onChange={handleOnChange}
                  required={!showLoginState}
                  error={!!formState.lastName.error}
                  helperText={formState.lastName.error}
                />
              </Grid>
            </Grid>
          </Collapse>
          <Grid container spacing={2} className={classes.gridContainer}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                autoComplete="email"
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={formState.email.value}
                variant="outlined"
                fullWidth
                margin="none"
                onChange={handleOnChange}
                required
                error={!!formState.email.error}
                helperText={formState.email.error}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="current-password"
                id="password"
                name="password"
                label="Password"
                type={showPasswordState ? 'text' : 'password'}
                value={formState.password.value}
                variant="outlined"
                fullWidth
                margin="none"
                onChange={handleOnChange}
                required
                error={!!formState.password.error}
                helperText={formState.password.error}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        tabIndex="-1"
                        onClick={handleToggleState('showPassword')}
                        onMouseDown={handleMouseDownAdornment}
                      >
                        {showPasswordState ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
          <Collapse in={!showLoginState}>
            <Grid container spacing={2} className={classes.gridContainer}>
              <Grid item xs={12}>
                <TextField
                  id="passwordConfirm"
                  name="passwordConfirm"
                  label="Confirm Password"
                  type={showPasswordState ? 'text' : 'password'}
                  value={formState.passwordConfirm.value}
                  variant="outlined"
                  fullWidth
                  margin="none"
                  onChange={handleOnChange}
                  required={!showLoginState}
                  error={!!formState.passwordConfirm.error}
                  helperText={formState.passwordConfirm.error}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          tabIndex="-1"
                          onClick={handleToggleState('showPassword')}
                          onMouseDown={handleMouseDownAdornment}
                        >
                          {showPasswordState ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>
          </Collapse>
          <Button
            className={classes.submit}
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            disabled={disable}
          >
            {showLoginState ? 'Login' : 'Sign Up'}
          </Button>
        </form>
        <Grid container justify="flex-end">
          <Grid item>
            <Link href="#" onClick={handleToggleState('showLogin')}>
              {showLoginState
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </Link>
          </Grid>
        </Grid>
      </div>
      <Snackbar
        open={!!errorState}
        message={errorState}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
}

Login.propTypes = {
  location: PropTypes.object.isRequired
};

export default Login;

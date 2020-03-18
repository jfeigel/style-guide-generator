import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import {
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';

import axios from 'axios';

import Logo from './Logo';
import GoogleButton from './GoogleButton';
import GitHubButton from './GitHubButton';
import { useAuth } from '../contexts';

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
  form: {
    width: '100%'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
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
  }
}));

function Login() {
  const classes = useStyles();
  const [state, setState] = useState({
    showPassword: false,
    isLoggedIn: false,
    error: { value: false, message: null },
    username: '',
    password: ''
  });
  const { setAuthTokens } = useAuth();

  const axiosAuth = axios.create({
    baseURL: 'http://localhost:5000/auth/',
    withCredentials: true
  });

  const handleChange = (field, prop) => event => {
    setState({ ...state, [field]: event.target[prop] });
  };

  const handleClickShowPassword = () => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const handleLogin = event => {
    event.preventDefault();
    setState({ ...state, error: { value: false, message: null } });

    axiosAuth
      .post('/login', {
        username: state.username,
        password: state.password
      })
      .then(result => {
        if (result.status === 200) {
          setAuthTokens(result.data);
          setState({ ...state, isLoggedIn: true });
        } else {
          setError(result.data);
        }
      })
      .catch(e => {
        setError(e.message);
      });
  };

  const setError = msg => {
    setState({ ...state, error: { value: true, message: msg } });
  };

  if (state.isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Container maxWidth="xs">
      <div className={classes.root}>
        {state.isError && (
          <MuiAlert variant="filled" elevation={1} severity="error">
            An Error Occurred!
          </MuiAlert>
        )}
        <Logo />
        <Grid className={classes.social} container spacing={2}>
          <Grid item md={6}>
            <GoogleButton
              text="Sign in"
              href="http://localhost:5000/auth/google"
            />
          </Grid>
          <Grid item md={6}>
            <GitHubButton
              text="Sign in"
              href="http://localhost:5000/auth/github"
            />
          </Grid>
        </Grid>
        <div className={classes.dividerContainer}>
          <Divider className={classes.divider} />
          <span>OR</span>
        </div>
        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <TextField
            id="username"
            label="Username"
            type="username"
            value={state.username}
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange('username', 'value')}
          />
          <TextField
            id="password"
            label="Password"
            type={state.showPassword ? 'text' : 'password'}
            value={state.password}
            variant="outlined"
            fullWidth
            margin="normal"
            onChange={handleChange('password', 'value')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                  >
                    {state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          <Button
            className={classes.submit}
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Login;

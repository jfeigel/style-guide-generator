import React, { useState } from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import GitHubIcon from '@material-ui/icons/GitHub';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import MuiAlert from '@material-ui/lab/Alert';

import axios from 'axios';

import { useAuth } from '../contexts';

const gitHubColors = {
  primary: '#24292e',
  dark: '#000004',
  light: '#4c5157'
};

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  formContainer: {
    width: '100%',
    maxWidth: 600,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    '& > button': {
      marginTop: theme.spacing(2)
    }
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    '& > *:not(button)': {
      margin: theme.spacing(1, 0)
    },
    '& button[type="submit"]': {
      alignSelf: 'flex-end',
      marginTop: theme.spacing(1.5)
    }
  },
  divider: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4)
  },
  enterprise: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    '& fieldset': {
      marginBottom: theme.spacing(0.5)
    }
  },
  gitHubButton: {
    color: theme.palette.getContrastText(gitHubColors.primary),
    backgroundColor: gitHubColors.primary,
    '&:hover': {
      backgroundColor: gitHubColors.dark
    }
  }
}));

function Login() {
  const classes = useStyles();
  const [state, setState] = useState({
    enterprise: false,
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
    <div className={classes.root}>
      <Paper className={classes.formContainer} variant="outlined">
        <Typography color="textSecondary" gutterBottom>
          Login
        </Typography>
        {state.isError && (
          <MuiAlert variant="filled" elevation={1} severity="error">
            An Error Occurred!
          </MuiAlert>
        )}
        <form className={classes.form} noValidate onSubmit={handleLogin}>
          <TextField
            id="username"
            label="Username"
            type="username"
            value={state.username}
            onChange={handleChange('username', 'value')}
          />
          <TextField
            id="password"
            label="Password"
            type={state.showPassword ? 'text' : 'password'}
            value={state.password}
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
          <Button variant="contained" color="primary" type="submit">
            Login
          </Button>
        </form>
        <Divider className={classes.divider} />
        <div className={classes.enterprise}>
          <FormControl component="fieldset">
            <FormGroup aria-label="enterprise" row>
              <FormControlLabel
                value="enterprise"
                control={
                  <Checkbox
                    checked={state.enterprise}
                    onChange={handleChange('enterprise', 'checked')}
                    value="enterprise"
                    color="secondary"
                  />
                }
                label="Enterprise"
              />
            </FormGroup>
          </FormControl>
          <TextField
            id="enterpriseUrl"
            label="Enterprise URL"
            required={state.enterprise}
            disabled={!state.enterprise}
            helperText={state.enterprise ? '*Required' : ' '}
          />
        </div>
        <Button
          className={classes.gitHubButton}
          variant="contained"
          color="primary"
          startIcon={<GitHubIcon />}
          component={RouterLink}
          to="/auth/github"
        >
          Log in with GitHub
        </Button>
      </Paper>
    </div>
  );
}

export default Login;

import React from 'react';

import { Link as RouterLink } from 'react-router-dom';

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

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import GitHubIcon from '@material-ui/icons/GitHub';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const gitHubColors = {
  primary: '#24292e',
  dark: '#000004',
  light: '#4c5157'
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

interface State {
  enterprise: boolean;
  showPassword: boolean;
}

function Login(): JSX.Element {
  const classes = useStyles();
  const [state, setState] = React.useState<State>({
    enterprise: false,
    showPassword: false
  });

  const handleChange = (name: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setState({ ...state, [name]: event.target.checked });
  };

  const handleClickShowPassword = (): void => {
    setState({ ...state, showPassword: !state.showPassword });
  };

  const { enterprise, showPassword } = state;

  return (
    <div className={classes.root}>
      <Paper className={classes.formContainer} variant="outlined">
        <Typography color="textSecondary" gutterBottom>
          Login
        </Typography>
        <form className={classes.form} noValidate autoComplete="off">
          <TextField id="username" label="Username" />
          <TextField
            id="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
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
                    checked={enterprise}
                    onChange={handleChange('enterprise')}
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
            required={enterprise}
            disabled={!enterprise}
            helperText={enterprise ? '*Required' : ' '}
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

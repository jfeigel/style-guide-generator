import React from 'react';
import {
  Avatar,
  Box,
  Container,
  Grid,
  Paper,
  SvgIcon
} from '@material-ui/core';
import { GitHub as GitHubIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import { ReactComponent as GoogleIcon } from '../images/google.svg';
import { useAuth } from '../contexts';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(10),
    padding: theme.spacing(4)
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center'
  },
  avatar: {
    width: '75%',
    height: 'auto'
  },
  icon: {
    '& + $icon': {
      marginLeft: '10px'
    }
  }
}));

/**
 * Account Component
 *
 * @component
 */
function Account() {
  const classes = useStyles();
  const { loggedInUser: user } = useAuth();

  return (
    <Container maxWidth="sm">
      <Paper className={classes.container} elevation={1}>
        <Grid container spacing={2}>
          <Grid className={classes.avatarContainer} item md={4}>
            <Avatar
              className={classes.avatar}
              alt={user.displayName}
              src={user.avatar}
            />
          </Grid>
          <Grid item md={8}>
            <div className={classes.info}>
              <Box flexGrow={1}>
                <Typography gutterBottom variant="h5" component="h2">
                  {user.displayName}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {user.email}
                </Typography>
              </Box>
              <div className={classes.row}>
                {user.providers.github && (
                  <SvgIcon className={classes.icon} component={GitHubIcon} />
                )}
                {user.providers.google && (
                  <SvgIcon className={classes.icon} component={GoogleIcon} />
                )}
              </div>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default Account;

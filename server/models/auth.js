const config = require('../config.json');

const { logger, passport } = require('../index');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;

const User = require('./user');

let port = '';
if (config.site.port !== 80) {
  port = `:${config.site.port}`;
}

passport.serializeUser((user, done) => {
  done(null, User.clean(user));
});

passport.deserializeUser((user, done) => {
  done(null, User.clean(user));
});

passport.use(
  new LocalStrategy((username, password, done) => {
    try {
      const result = User.authenticate(username, password);
      if (!result.user) return done(null, false, result.message);
    } catch (err) {
      logger.error(err.stack);
      return done(err);
    }

    return done(null, user);
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: config.site.oauth.github.clientID,
      clientSecret: config.site.oauth.github.clientSecret,
      callbackURL: `${config.site.oauth.host}${port}/auth/github/callback`
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

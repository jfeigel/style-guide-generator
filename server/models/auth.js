const passport = require('../index').passport;
const config = require('../config.json');

let port = '';
if (config.site.port !== 80) {
  port = `:${config.site.port}`;
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const GitHubStrategy = require('passport-github').Strategy;
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

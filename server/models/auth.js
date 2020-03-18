const config = require('../config.json');

const { logger, passport } = require('../index');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const UserModel = require('./user');

let port = '';
if (config.site.port !== 80) {
  port = `:${config.site.port}`;
}

passport.serializeUser((user, done) => {
  done(null, UserModel.clean(user));
});

passport.deserializeUser((user, done) => {
  done(null, UserModel.clean(user));
});

passport.use(
  new LocalStrategy((username, password, done) => {
    try {
      const result = UserModel.authenticate(username, password);
      if (!result.user) {
        return done(null, false, result.message);
      }
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
    verifyCallback
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.site.oauth.google.clientID,
      clientSecret: config.site.oauth.google.clientSecret,
      callbackURL: `${config.site.oauth.host}${port}/auth/google/callback`
    },
    verifyCallback
  )
);

async function verifyCallback(accessToken, refreshToken, profile, done) {
  try {
    let user = await UserModel.getByProviderId(profile.provider, profile.id);
    if (user) {
      return done(null, user);
    }

    const userData = {
      providers: {},
      email: (profile.emails.find(email => email.verified) || profile.emails[0])
        .value,
      firstName: (profile.name && profile.name.givenName) || null,
      lastName: (profile.name && profile.name.familyName) || null,
      displayName: profile.displayName
    };
    userData.providers[profile.provider] = profile.id;
    user = await UserModel.create(userData);

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}

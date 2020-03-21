/**
 * @module AuthModel
 * @category Backend
 * @requires UserModel
 */
import config from '../config';

import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';

import * as UserModel from './user';

/**
 * Default function for Auth Model
 *
 * @function
 * @param {object} passport Passport object
 */
export default function authModel(passport) {
  let port = '';
  if (config.site.port !== 80) {
    port = `:${config.site.port}`;
  }

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  passport.deserializeUser(async (email, done) => {
    try {
      const user = await UserModel.getByEmail(email);
      if (!user) {
        return done(new Error('user not found'));
      }
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (username, password, done) => {
        let result;
        try {
          result = await UserModel.authenticate(username, password);
          if (!result.user) {
            return done(null, false, result);
          }
        } catch (err) {
          return done(err);
        }

        return done(null, result.user);
      }
    )
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

  /**
   * Verify callback function for OAuth sign in through Passport
   *
   * @async
   * @function
   * @param {string} accessToken Access Token for logged in User
   * @param {string} refreshToken Refresh Token for logged in User
   * @param {object} profile User data
   * @param {Function} done Callback function
   */
  async function verifyCallback(accessToken, refreshToken, profile, done) {
    try {
      let user = await UserModel.getByProviderId(profile.provider, profile.id);
      if (user) {
        return done(null, user);
      }

      const userData = {
        providers: {},
        email: (
          profile.emails.find(email => email.verified) || profile.emails[0]
        ).value,
        firstName: (profile.name && profile.name.givenName) || null,
        lastName: (profile.name && profile.name.familyName) || null,
        displayName: profile.displayName,
        avatar:
          (profile.photos && profile.photos[0] && profile.photos[0].value) ||
          null
      };
      userData.providers[profile.provider] = profile.id;
      user = await UserModel.create(userData);

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
}

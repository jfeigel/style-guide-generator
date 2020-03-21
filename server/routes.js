/**
 * Router definition for the Server
 *
 * @category Backend
 * @module Router
 * @requires UserController
 */
import Router from 'koa-router';
import { readFile } from 'fs';

import * as UserController from './controllers/user';

/**
 * Default function for Router
 *
 * @function
 * @param {object} app Koa app object
 * @param {object} passport Passport object
 */
export default function routes(app, passport) {
  const router = new Router();

  /**
   * Load the production HTML file
   *
   * @returns {Promise<object|Error>} Contents of file or Error
   */
  function loadHtml() {
    return new Promise((resolve, reject) => {
      readFile(
        './dist/index.html',
        {
          encoding: 'utf8'
        },
        (err, data) => (err ? reject(err) : resolve(data))
      );
    });
  }

  if (process.env.NODE_ENV === 'production') {
    router.get(/^\/(.*)(?:\/|$)/, async (ctx, next) => {
      if (/^\/(api|auth)/.test(ctx.request.url)) {
        await next();
      } else {
        ctx.body = await loadHtml();
      }
    });
  }

  router.get('/api/*', async (ctx, next) => {
    if (!ctx.isAuthenticated()) {
      ctx.throw(401);
    }

    await next();
  });

  router.get('/api/user', async (ctx, next) => {
    ctx.body = ctx.state.user;
    await next();
  });

  router.post('/auth/login', ctx =>
    passport.authenticate('local', async (err, user, info) => {
      if (err) {
        throw err;
      }
      if (!user) {
        ctx.throw(info.status, info.message);
      } else {
        await ctx.login(user);
        ctx.body = user;
      }
    })(ctx)
  );

  router.post('/auth/register', UserController.register);

  router.post('/auth/logout', ctx => {
    ctx.logout();
    ctx.status = 204;
  });

  router.get('/auth/github', passport.authenticate('github'));
  router.get(
    '/auth/github/callback',
    passport.authenticate('github', {
      successRedirect: 'http://localhost:3000/success/github',
      failureRedirect: 'http://localhost:3000/login'
    })
  );

  router.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    })
  );
  router.get(
    '/auth/google/callback',
    passport.authenticate('google', {
      successRedirect: 'http://localhost:3000/success/google',
      failureRedirect: 'http://localhost:3000/login'
    })
  );

  app.use(router.routes());
  app.use(router.allowedMethods());
}

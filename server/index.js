/**
 * @module Server
 * @category Backend
 * @requires logger
 * @requires db
 * @requires AuthModel
 * @requires Router
 */
import config from './config';
import logger from './logger';

import Koa from 'koa';
import cors from '@koa/cors';
import serve from 'koa-static';

import session from 'koa-generic-session';
import redis from 'koa-redis';
import bodyParser from 'koa-bodyparser';
import passport from 'koa-passport';

import * as db from './helpers/db';
import authModel from './models/auth';
import router from './routes';

export const app = new Koa();
app.use(
  cors({
    credentials: true
  })
);

app.proxy = true;

app.keys = [config.site.secret];
if (process.env.NODE_ENV === 'production') {
  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24
      },
      store: redis()
    })
  );
} else {
  app.use(session(app));
}

app.use(bodyParser());

app.use(passport.initialize());
app.use(passport.session());

authModel(passport);
router(app, passport);

if (process.env.NODE_ENV === 'production') {
  app.use(serve('./dist'));
}

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});

logger.info(
  `${config.site.name} is now listening on port ${config.site.port}.`
);
app.listen(config.site.port);

(async () => {
  await db.connect();
})().catch(err => {
  logger.error(err.message);
});

app.on('error', (err, ctx) => {
  logger.error(`${ctx && ctx.status && `${ctx.status} | `}${err}`);
});

process.on('SIGINT', async function exit() {
  logger.info('SIGINT signal received.');
  try {
    await db.disconnect();
    logger.info('Disconnected from MongoDB');
  } catch (err) {
    logger.error(err.message);
  } finally {
    logger.info('Process exiting');
    process.exit();
  }
});

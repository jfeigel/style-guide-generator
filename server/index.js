const config = require('./config');
const logger = require('./logger');

const Koa = require('koa');
const cors = require('@koa/cors');
const serve = require('koa-static');

const session = require('koa-generic-session');
const redis = require('koa-redis');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');

const db = require('./helpers/db');

const app = new Koa();
app.use(
  cors({
    credentials: true
  })
);

module.exports = {
  app: app,
  logger: logger,
  passport: passport
};

require('./models/auth');

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

require('./routes');

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

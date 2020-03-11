const config = require('./config');

const Koa = require('koa');
const cors = require('@koa/cors');
const serve = require('koa-static');

const session = require('koa-generic-session');
const redis = require('koa-redis');
const bodyParser = require('koa-bodyparser');
const passport = require('koa-passport');

const app = new Koa();
app.use(
  cors({
    credentials: true
  })
);

exports.app = app;
exports.passport = passport;

// require('./models/auth');

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

console.log(
  `${config.site.name} is now listening on port ${config.site.port}.`
);
app.listen(config.site.port);

process.on('SIGINT', function exit() {
  process.exit();
});

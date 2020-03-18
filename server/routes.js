const { app, passport } = require('./index');
const Router = require('koa-router');
const fs = require('fs');

const router = new Router();

function loadHtml() {
  return new Promise((resolve, reject) => {
    fs.readFile(
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
      this.body = await loadHtml();
    }
  });
}

router.post('/auth/login', ctx =>
  passport.authenticate('local', async (err, user) => {
    if (err) throw err;
    if (!user) {
      ctx.throw(401, err);
    } else {
      await ctx.login(user);
      ctx.body = user;
    }
  })(ctx)
);

router.post('/auth/logout', ctx => {
  ctx.logout();
  ctx.status = 204;
});

router.get('/auth/github', passport.authenticate('github'));
router.get(
  '/auth/github/callback',
  passport.authenticate('github', {
    successRedirect: 'http://localhost:3000/github/success',
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
    successRedirect: 'http://localhost:3000/google/success',
    failureRedirect: 'http://localhost:3000/login'
  })
);

app.use(router.routes());
app.use(router.allowedMethods());

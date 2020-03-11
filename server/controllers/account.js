module.exports = {
  login: login,
  logout: logout
};

async function login(ctx) {
  let user;
  if (ctx.isAuthenticated()) {
    user = ctx.session.passport.user;
  }
  await ctx.render('login', {
    user: user
  });
}

async function logout(ctx) {
  ctx.logout();
  await ctx.redirect('/');
}

module.exports = (req, res, next) => {
  console.log('\x1B[32m%s\x1b[0m', 'auth-handler message');
  if (req.isAuthenticated()) {
    res.locals.user_name = req.user.name;
    return next();
  }
  req.flash('error', '尚未登入');
  return res.redirect('/login');
};

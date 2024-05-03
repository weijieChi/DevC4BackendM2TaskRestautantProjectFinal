module.exports = (req, res, next) => {
  console.log('\x1B[33m%s\x1b[0m', 'message-handler message');
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
};

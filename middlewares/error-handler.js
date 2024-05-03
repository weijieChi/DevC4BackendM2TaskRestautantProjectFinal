module.exports = (error, req, res, next) => {
  console.log('\x1B[32m%s\x1b[0m', 'error-handler message');
  console.error(error);
  req.flash('error', error.errorMessage || '處理失敗:(');
  next(error);
  res.redirect('back');
};

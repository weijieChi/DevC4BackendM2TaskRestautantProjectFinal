const express = require('express');

const router = express.Router();

// passport 模組
const passport = require('../config/passport');

router.get('/', (req, res) => {
  res.redirect('/restaurants');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/delete-account', (req, res) => {
  res.render('delete-account');
});

// delete-facebook by OAuth2
router.get('/delete-account/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }
    req.flash('success', '登出成功！');
    return res.redirect('/login');
  });
});

// facebook OAuth2
router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/todos',
  failureRedirect: '/login',
  failureFlash: true,
}));

module.exports = router;

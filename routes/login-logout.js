const express = require('express');

const router = express.Router();

// passport 模組
const passport = require('../config/passport');

// const db = require('../models');

// const { User } = db;

router.get('/', (req, res) => {
  res.redirect('/restaurants');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true,
}));

router.post('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error);
    }

    return res.redirect('/login');
  });
});

// facebook OAuth2
// router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
//   successRedirect: '/todos',
//   failureRedirect: '/login',
//   failureFlash: true,
// }));

module.exports = router;

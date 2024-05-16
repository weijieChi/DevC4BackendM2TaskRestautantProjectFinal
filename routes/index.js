const express = require('express');

const router = express.Router();
const loginLogout = require('./login-logout');
const restaurants = require('./restaurants');
const users = require('./users');

const authHandler = require('../middlewares/auth-handler');

router.use('/', loginLogout);
router.use('/restaurants', authHandler, restaurants);
router.use('/users', users);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {...})

// router.get('/', (req, res) => {
//   res.redirect('/restaurants');
// });

module.exports = router;

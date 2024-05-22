const express = require('express');

const router = express.Router();
const loginLogout = require('./modules/login-logout');
const restaurants = require('./modules/restaurants');
const users = require('./modules/users');

const authHandler = require('../middlewares/auth-handler');

router.use('/', loginLogout);
router.use('/restaurants', authHandler, restaurants);
router.use('/users', users);

// catch 404 and forward to error handler
router.use((req, res) => {
  res.status(404).render('notFoundPage');
});

module.exports = router;

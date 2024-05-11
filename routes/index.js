const express = require('express');

const router = express.Router();
const restaurants = require('./restaurants');
const loginLogout = require('./login-logout');

router.use('/', loginLogout);
router.use('/restaurants', restaurants);

// router.get('/', (req, res) => {
//   res.redirect('/restaurants');
// });

module.exports = router;

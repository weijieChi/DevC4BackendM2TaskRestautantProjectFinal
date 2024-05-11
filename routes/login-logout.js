const express = require('express');

const router = express.Router();

const db = require('../models');

const { User } = db;

router.get('/', (req, res) => {
  res.redirect('/restaurants');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;

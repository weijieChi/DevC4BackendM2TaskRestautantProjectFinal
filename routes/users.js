// express router
const express = require('express');

const router = express.Router();

// bcrypt
const bcrypt = require('bcryptjs');

const authHandler = require('../middlewares/auth-handler');

// Sequelize Database
const db = require('../models');

const { User } = db;

router.post('/', (req, res, next) => {
  // console.log('users/register');
  // console.log(req.body);
  // res.redirect('/register');
  const {
    email, name, password, confirmPassword,
  } = req.body;

  if (!email || !password) {
    req.flash('error', 'email 及 password 為必填');
    return res.redirect('back');
  }

  // 檢查密碼與再確認密碼的值是否相同
  if (password !== confirmPassword) {
    req.flash('error', '密碼與再確認密碼不相同');
    return res.redirect('back');
  }

  // 檢查 email 是否已經註冊
  User.count({
    where: email,
  })
    .then((rowCount) => {
      if (rowCount > 0) {
        req.flash('error', 'email 已註冊');
        return res.redirect('back');
      }
    })
    .catch((error) => {
      const err = error;
      err.errorMessage = '伺服器錯誤';
      next(err);
    });

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        name,
        password: hash,
      })
        .catch((error) => {
          const err = error;
          err.errorMessage = '註冊失敗';
          next(err);
        });
    });
  req.flash('success', '註冊成功');
  return res.redirect('/login');
});

router.delete('/', authHandler, (req, res) => {
  res.redirect('/');
});

module.exports = router;

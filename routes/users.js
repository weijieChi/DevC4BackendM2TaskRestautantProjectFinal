// express router
const express = require('express');

const router = express.Router();

// bcrypt
const bcrypt = require('bcryptjs');

// passport
// const passport = require('../config/passport');

// Sequelize Database
const db = require('../models');

const { User } = db;

router.post('/', (req, res, next) => {
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
    where: { email },
  })
    .then((rowCount) => {
      if (rowCount > 0) {
        req.flash('error', 'email 已註冊');
        return res.redirect('back');
      }
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
    })
    .catch((error) => {
      const err = error;
      err.errorMessage = '伺服器錯誤';
      next(err);
    });
});

// router.delete('/login', passport.authenticate('local', {
//   successRedirect: '/restaurants',
//   failureRedirect: '/login',
//   failureFlash: true,
// }));

router.delete('/', (req, res, next) => {
  const { email } = req.user;
  User.findOne({
    attributes: ['id', 'name', 'email'],
    where: { email },
  })
    .then((user) => {
      if (!user) {
        req.flash('error', '找不到該帳戶！');
        return res.redirect('/login');
      }
      User.destroy({ where: { id: user.id } })
        .then(() => {
          req.logout((error) => {
            if (error) {
              return next(error);
            }
          });
          req.flash('success', '帳號刪除成功！'); // 不知道被什麼蓋掉了，無法顯示
          return res.redirect('/login');
        })
        .catch((error) => {
          const err = error; // ESlint: no-param-reassign
          err.errorMessage = '帳號刪除失敗！';
          next(err);
        });
    })
    .catch((error) => {
      const err = error; // ESlint: no-param-reassign
      err.errorMessage = '帳號刪除失敗！';
      next(err);
    });
});

module.exports = router;

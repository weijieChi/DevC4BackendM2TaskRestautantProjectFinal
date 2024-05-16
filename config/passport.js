// passport 模組
const passport = require('passport');

const LocalStrategy = require('passport-local');

// const FacebookStrategy = require('passport-facebook');

// bcryptjs
const bcrypt = require('bcryptjs');

//  Passport 也需要去存取使用者的資料，所以我們也必須載入 User model
const db = require('../models');

const { User } = db;

// passport LocalStrategy
passport.use(new LocalStrategy({ usernameField: 'email' }, (username, password, done) => {
  User.findOne({
    attributes: ['id', 'name', 'email', 'password'],
    where: { email: username },
    raw: true,
  })
    .then((user) => { // 檢查是否存在該帳號
      if (!user) {
        return done(null, false, { message: 'email email 或是密碼錯誤' });
      }
      // 檢查密碼是否正確
      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return done(null, false, { message: 'email 或是密碼錯誤' });
          }
          // 登入成功
          return done(null, user);
        })
        .catch((error) => {
          const err = error;
          err.message = 'bcryptjs compare error.';
          return done(err);
        });
    })
    .catch((error) => {
      const err = error;
      err.message = '登入失敗！';
      return done(err);
    });
}));

// 使用者帳號登入成功時候使用
// passport serialize 將登入成功後的使用者關聯資料放到 session 當中
passport.serializeUser((user, done) => {
  console.log('\x1B[32m%s\x1b[0m', 'serializeUser message');
  const { id, name, email } = user;
  return done(null, { id, name, email });
});

// 當使用者已經登入，並且已經存在 session ，決定要把那些使用者資料放到 req.user 當中
// passport deserialize 會將這個資料放到 req.user 這個屬性
passport.deserializeUser((user, done) => {
  console.log('\x1B[32m%s\x1b[0m', 'deserializeUser message');
  done(null, { id: user.id, name: user.name });
});

module.exports = passport;

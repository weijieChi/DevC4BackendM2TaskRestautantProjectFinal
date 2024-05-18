// passport 模組
const passport = require('passport');

const LocalStrategy = require('passport-local');

const FacebookStrategy = require('passport-facebook');

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

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL, // 登入成功導回至哪個 url
  profileFields: ['email', 'displayName'], // 取得使用者資料的哪些欄位,並回傳至 callback 的 profile 參數
}, (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    return User.findOne({
      attributes: ['id', 'name', 'email'],
      where: { email },
      raw: true,
    })
      .then((user) => {
        if (user) {
          return done(null, user);
        }

        const randomPwd = Math.random().toString(36).slice(-8);

        return bcrypt.hash(randomPwd, 10)
          .then((hash) => User.create({ name, email, password: hash }))
          .then((userData) => done(null, { // user, ESlint: no-shadow 這個變數名稱已經使用過了
            id: userData.id,
            name: userData.name,
            email: userData.email,
          }));
      })
      .catch((error) => {
        const err = error;
        err.errorMessage = '登入失敗';
        done(err);
      });
  } catch (err) {
    done(err);
  }
}));

// serialize 序列化 將登入成功的使用者部分資料放到 session 當中
// 這格程序只會在登入成功後被呼叫一次，用來將需要的使用者資料存到 session 當中，作為後續程序使用。
// 可以由 req.user.[key] 來在程序當中呼叫所需使用者參數
// serializeUser((user, done) 當中的 user 即是在 passport.use(new LocalStrategy 登入成功後在
// done(null, user) 所放入的參數
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

// express
const express = require('express');

const app = express();
const port = 3000;

// express-session
const session = require('express-session');

const flash = require('connect-flash');

// express-handlebars
const { engine } = require('express-handlebars');

// passport
// eslint-disable-next-line import/no-extraneous-dependencies
const passport = require('passport');

// method-override
const methodOverrid = require('method-override');

// dotenv
const dotenv = require('dotenv');

// const exphbs = require('express-handlebars');

// exphbs.create({
//   // eslint-disable-next-line global-require
//   helpers: require('./config/handlebars-helpers'),
//   defaultLayout: 'main',
//   extname: '.hbs',
// });
const helpers = require('./config/handlebars-helpers');

// 載入自定義 helpers 的檔案
// eslint-disable-next-line import/order
const handlebars = require('handlebars');

handlebars.registerHelper(helpers);

app.engine('.hbs', engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', './views');

// middleware
// middlewares message-handler
const messageHandler = require('./middlewares/message-handler');
// middlewares error-handler
const errorHandler = require('./middlewares/error-handler');

if (process.env.NODE_ENV === 'development') {
  dotenv.config();
}
// router
const router = require('./routes');

// express static file
app.use(express.static('public'));

// method-override
app.use(methodOverrid('_method'));

// bodyParser & x-www-form-urlencoded to json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// exoress-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// connect-flash
app.use(flash());

// passport initialize
// 確認 passport.user 是否已存在，若沒有則初始化一個空的。
app.use(passport.initialize());
// 用以處理 Session。若有找到 passport.user，則判定其通過驗證，並呼叫 deserializeUser()。
app.use(passport.session());

// middlewares message-handler
app.use(messageHandler);

// router
app.use(router);

// middlewares error-handler
app.use(errorHandler);

// listen
app.listen(port, () => {
  console.log('\x1b[33m%s\x1b[0m', new Date().toLocaleString());
  console.log(`express server on http://localhost:${port}`);
});

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const createError = require('http-errors');
const path = require('path');
//const passport = require('passport');
const history = require('connect-history-api-fallback');
const log = require('logerator')

//var cors = require('cors');
const { sequelize } = require('./models');
const index = require('./routes/index');
//const passportConfig = require('./passport');
require('dotenv').config();

const app = express();
sequelize.sync();
//passportConfig(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 3000);

app.use('/api', require('./routes/api'));
app.use(history());
app.use(express.static(path.join(__dirname, 'fe', 'dist')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));
app.use(flash());
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({ msg: err.message })
});

app.listen(app.get('port'),() => {
  console.log(app.get('port'), '번 포트에서 대기 중')
})

module.exports = app;
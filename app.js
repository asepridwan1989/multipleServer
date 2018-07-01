const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const todoRouter = require('./routes/todo');
const article = require('./routes/article')

const mongoose = require('mongoose')
const app = express();
const Promise = require('bluebird')
const steam = require('./middlewares/steam_auth');
require('dotenv').config()
const userdb = process.env.USERDB
const passdb = process.env.PASSDB
mongodb://<dbuser>:<dbpassword>@ds217921.mlab.com:17921/portofolioserver
mongoose.connect(`mongodb://${userdb}:${passdb}@ds217921.mlab.com:17921/portofolioserver`, (err) => {
  if(err) {
    console.log(`failed to connect database`)
  } else {
    console.log(`successfuly connected to database`)
  }
});

const db = mongoose.connection
db.on('error',console.error.bind(console,'connection to db error:'))
db.once('open', function(){
    console.log('connected to db')
})
// view engine setup
app.use(require('express-session')({ resave: false, saveUninitialized: false, secret: 'a secret' }));
app.use(steam.middleware({
	realm: 'http://localhost:3000/',
	verify: 'http://localhost:3000/users/verify',
	apiKey: "474010677BCBCE2E6ECDB57D83300C17"}
));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/todo', todoRouter);
app.use('/articles', article);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
var cors = require('cors');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const req = require('express/lib/request');
var gameApiRouter = require('./routes/gameApi');
var gameRouter = require('./routes/gameApi');

var app = express();
app.use(cors());

mongoose.connect('mongodb+srv://admin:auf123@cluster0.zzaup.mongodb.net/pokerclocks?retryWrites=true&w=majority')
    .then(console.log('connected to db!'))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/game', gameRouter);
app.use('/gameApi',gameApiRouter);
app.get('/test',function(req,res){      
  res.sendFile(path.join(__dirname,'/socket.html'));
  });
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

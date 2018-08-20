var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//Custom Modules
var getweather = require('./custom_modules/getweather');
var sprinkler = require('./custom_modules/sprinkler');
var config = require('./custom_modules/config');

//Routers
var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var sprinkler1Router = require('./routes/sprinkler1');
var sprinkler2Router = require('./routes/sprinkler2');
var sprinkler3Router = require('./routes/sprinkler3');
var sprinkler4Router = require('./routes/sprinkler4');

var app = express();

//Sprinkler setup
sprinkler.initializeDB();
var sprinkler1 = new sprinkler.CreateSprinkler('sprinkler1', config.sprinkler1Pin);
var sprinkler2 = new sprinkler.CreateSprinkler('sprinkler2', config.sprinkler2Pin);
var sprinkler3 = new sprinkler.CreateSprinkler('sprinkler3', config.sprinkler3Pin);
var sprinkler4 = new sprinkler.CreateSprinkler('sprinkler4', config.sprinkler4Pin);
// sprinkler1.commitAllTimers();
app.set('sprinkler1', sprinkler1);
app.set('sprinkler2', sprinkler2);
app.set('sprinkler3', sprinkler3);
app.set('sprinkler4', sprinkler4);


// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Cookie/body parsing setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/about', aboutRouter);
app.use('/sprinkler1', sprinkler1Router);
app.use('/sprinkler2', sprinkler2Router);
app.use('/sprinkler3', sprinkler3Router);
app.use('/sprinkler4', sprinkler4Router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if(err.message == "Not Found"){
    res.locals.message = "Error 404, page not found."
    res.locals.subMessage= "Perhaps you were looking for something else?"
  }
  else
    res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else res.render('error', content);
  });
});

module.exports = app;

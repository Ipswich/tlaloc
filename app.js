var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
var Gpio = require('onoff').Gpio;
const exec = require('child_process').exec;

//Custom Modules
var getweather = require('./custom_modules/getweather');
var sprinkler = require('./custom_modules/sprinkler');
var settings = require('./custom_modules/settings');

//Routers
var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
//Sprinkler1
var sprinkler1Router = require('./routes/sprinkler1');
var temperature1Router = require('./routes/temperature1');
//Sprinkler2
var sprinkler2Router = require('./routes/sprinkler2');
var temperature2Router = require('./routes/temperature2');
//Sprinkler3
var sprinkler3Router = require('./routes/sprinkler3');
var temperature3Router = require('./routes/temperature3')
//Sprinkler4
var sprinkler4Router = require('./routes/sprinkler4');
var temperature4Router = require('./routes/temperature4')

var settingsRouter = require('./routes/settings');

//Create App
var app = express();

var data;
var fertilizePin;
var heaterPin;

var sprinkler1;
var sprinkler2;
var sprinkler3;
var sprinkler4;

//Load settings data
//OneWire Sensor Setup (load LKMs for thermoprobe)
console.log("Loading onewire drivers...");
exec('sh ./bin/modules.sh', (error, stdout, stderr) =>{
  if(error != null){
    console.log("An error has occurred, please load onewire drivers manually (tlaloc/bin/modules.sh)");
    console.log(error)
    process.exit(0);
  }
  else {
    console.log("Onewire drivers loaded successfully.");
  }
});

//Promise for DB creation
new Promise((resolve, reject) => {
  //Check if JSON file has been initialized, if not create empty file
  if(!db.has("settings").value()){
    db.defaults(settings.defaultContent).write();
    db.read();
  }
  else {
    console.log("Database file/data already exists, skipping creation. . .")
  }
  resolve();
})
.then(() => {
  data = settings.settingsFunctions.getSettingsData()
})
.then(() => {
  if (Gpio.accessible) {
    fertilizePin = new Gpio(data.settings.fertilizePin, 'out');
    heaterPin = new Gpio(data.settings.heaterPin, 'out');
  } else {
      console.log('Virtual fertilizer now uses value: ' + data.fertilizePin);
      console.log('Virtual heater now uses value: ' + data.heaterPin);
  }
})
.then(() => {
  sprinkler1 = new sprinkler.CreateSprinkler('sprinkler1', data.sprinkler1Pin, fertilizePin, heaterPin);
  sprinkler2 = new sprinkler.CreateSprinkler('sprinkler2', data.sprinkler2Pin, fertilizePin, heaterPin);
  sprinkler3 = new sprinkler.CreateSprinkler('sprinkler3', data.sprinkler3Pin, fertilizePin, heaterPin);
  sprinkler4 = new sprinkler.CreateSprinkler('sprinkler4', data.sprinkler4Pin, fertilizePin, heaterPin);

  sprinkler1.commitAllTimers();
  sprinkler2.commitAllTimers();
  sprinkler3.commitAllTimers();
  sprinkler4.commitAllTimers();
})
.then(() => {
  app.set('fertilizePin', fertilizePin);
  app.set('heaterPin', heaterPin);
  app.set('sprinkler1', sprinkler1);
  app.set('sprinkler2', sprinkler2);
  app.set('sprinkler3', sprinkler3);
  app.set('sprinkler4', sprinkler4);
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Cookie/body parsing setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes //
//Generic All
app.use('/', indexRouter);
app.use('/about', aboutRouter);
//Sprinkler1
app.use('/sprinkler1', sprinkler1Router);
app.use('/temperature1', temperature1Router);
//Sprinkler2
app.use('/sprinkler2', sprinkler2Router);
app.use('/temperature2', temperature2Router);
//Sprinkler3
app.use('/sprinkler3', sprinkler3Router);
app.use('/temperature3', temperature3Router);
//Sprinkler4
app.use('/sprinkler4', sprinkler4Router);
app.use('/temperature4', temperature4Router);
//Settings
app.use('/settings', settingsRouter)

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

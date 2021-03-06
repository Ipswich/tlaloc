#!/usr/bin/env node
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const exec = require('child_process').exec;
const five = require('johnny-five');


//Custom Modules
var getweather = require('./custom_modules/getweather');
var Sprinkler = require('./custom_modules/sprinkler');
var settings = require('./custom_modules/settings');
//Routers
var indexRouter = require('./routes/index');
var aboutRouter = require('./routes/about');
var lightsRouter = require('./routes/lightsToggle');
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
//Settings
var settingsRouter = require('./routes/settings');
//API Router
var APIRouter = require('./routes/state');

//Create App
var app = express();

var data;
var fertilizePin;
var heaterPin;

var sprinkler1;
var sprinkler2;
var sprinkler3;
var sprinkler4;

//Create arduino board object.
var arduino = new five.Board({repl: false});
app.set('arduino', arduino);
var heaterRelay;
var coolerRelay;
var fertilizeRelay;
var lightsRelay;
var lightsButton;
var thermometer1;
var thermometer2;

//Promise for app initilization
new Promise((resolve, reject) => {
  //Check if JSON file has been created/initialized, if not create file and/or set defaults
  if(!db.has("settings").value()){
    console.log("No database file/data detected, creating file with defaults. . .")
    db.defaults(settings.defaultContent).write();
    db.read();
  }
  else {
    console.log("Database file/data already exists, skipping creation. . .");
  }
  resolve();
})
.then(() => {
  data = settings.settingsFunctions.getSettingsData();
  return data;
})
.then((data) => {
  //Setup arduino board
  arduino.on("ready", function(){
    console.log("Arduino has connected successfully.\n");
    fertilizeRelay = new five.Relay(data.fertilizePin);
    heaterRelay = new five.Relay(data.heaterPin);
    coolerRelay = new five.Relay(data.coolerPin);
    lightsRelay = new five.Relay({
      pin: data.lightsPin,
      type: "NC"
    });
    // lightsButton = new five.Button({
    //   pin: data.lightsPin,
    //   isPullDown: true,
    // });
    lightsRelay.off();
    thermometer1 = new five.Thermometer({
      controller: "DS18B20",
      pin: data.thermometerPin,
      // address: data.thermometer1,
      freq: 1000 * 60 * 5
    });
    // thermometer2 = new five.Thermometer({
    //   controller: "DS18B20",
    //   pin: data.thermometerPin,
    //   address: data.thermometer2,
    //   freq: 1000 * 60 * 5
    // });
    // thermometer3 = new five.Thermometer({
    //   controller: "DS18B20",
    //   pin: data.thermometerPin,
    //   address: data.thermometer3
    // });
    // thermometer4 = new five.Thermometer({
    //   controller: "DS18B20",
    //   pin: data.thermometerPin,
    //   address: data.thermometer4
    // });
    console.log('Thermometers use Arduino pin: ' + data.thermometerPin);
    console.log('Fertilizer uses Arduino pin: ' + data.fertilizePin);
    console.log('Heater uses Arduino pin: ' + data.heaterPin);
    console.log('Cooler uses Arduino pin: ' + data.coolerPin);
    console.log('Lights use Arduino pin: ' + data.lightsPin);
    app.set('thermometer1', thermometer1);
    // app.set('thermometer2', thermometer2);
    // app.set('thermometer3', thermometer3);
    // app.set('thermometer4', thermometer4);
    this.on("exit", function(){
        //Exit cleanup
    });
  });
  return;
})
.then(() => {
  arduino.on("ready", function(){
    sprinkler1 = new Sprinkler('sprinkler1', data.sprinkler1Pin, fertilizeRelay, heaterRelay, coolerRelay, arduino, thermometer1);
    sprinkler2 = new Sprinkler('sprinkler2', data.sprinkler2Pin, fertilizeRelay, heaterRelay, coolerRelay, arduino, thermometer1);
    sprinkler3 = new Sprinkler('sprinkler3', data.sprinkler3Pin, fertilizeRelay, heaterRelay, coolerRelay, arduino, thermometer1);
    sprinkler4 = new Sprinkler('sprinkler4', data.sprinkler4Pin, fertilizeRelay, heaterRelay, coolerRelay, arduino, thermometer1);
    sprinkler1.commitAllTimers();
    sprinkler2.commitAllTimers();
    sprinkler3.commitAllTimers();
    sprinkler4.commitAllTimers();
  });

}).then(() => {
  //Initialize Check for Heat/cool tasks
  arduino.on("ready", function(){
    thermometer1.on("change", function(){
      if(data.degreeType == "C"){
        sprinkler1.temperatureHeatTask(this.C, sprinkler1);
        sprinkler3.temperatureHeatTask(this.C, sprinkler3);
        sprinkler4.temperatureHeatTask(this.C, sprinkler4);
        sprinkler1.temperatureCoolTask(this.C, sprinkler1);
        sprinkler3.temperatureCoolTask(this.C, sprinkler3);
        sprinkler4.temperatureCoolTask(this.C, sprinkler4);
      }
      else{
      sprinkler1.temperatureHeatTask(this.F, sprinkler1);
      sprinkler3.temperatureHeatTask(this.F, sprinkler3);
      sprinkler4.temperatureHeatTask(this.F, sprinkler4);
      sprinkler1.temperatureCoolTask(this.F, sprinkler1);
      sprinkler3.temperatureCoolTask(this.F, sprinkler3);
      sprinkler4.temperatureCoolTask(this.F, sprinkler4);
      }
    });
    // thermometer2.on("change", function(){
    //   if(data.degreeType == "C"){
    //     sprinkler2.temperatureHeatTask(this.C, sprinkler2)
    //     sprinkler2.temperatureCoolTask(this.C, sprinkler2)
    //   }
    //   else{
    //     sprinkler2.temperatureHeatTask(this.F, sprinkler2);
    //     sprinkler2.temperatureCoolTask(this.F, sprinkler2);
    //   }
    //
    // })
    //Initialize Temperature Logging 30 MINUTE INTERVALS
    setInterval(function(){sprinkler1.logTemperature()}, (1000 * 60 * 30));
    setInterval(function(){sprinkler2.logTemperature()}, (1000 * 60 * 30));
    setInterval(function(){sprinkler3.logTemperature()}, (1000 * 60 * 30));
    setInterval(function(){sprinkler4.logTemperature()}, (1000 * 60 * 30));

    // lightsButton.on("down", function(){
    //   console.log("Pressed!");
    //   lightsRelay.toggle();
    // });
    // lightsButton.on("up", function(){
    //   console.log("Released!");
    //   lightsRelay.toggle();
    // });
    // lightsButton.on("hold", function(){
    //   console.log("Held!");
    // });
    return;
  });
})
.then(() => {
  arduino.on("ready", function(){
    app.set('fertilizePin', fertilizePin);
    app.set('heaterPin', heaterPin);
    app.set('lightsRelay', lightsRelay);
    app.set('sprinkler1', sprinkler1);
    app.set('sprinkler2', sprinkler2);
    app.set('sprinkler3', sprinkler3);
    app.set('sprinkler4', sprinkler4);

    console.log("Initilization and setup successfully completed!");
    return;
  })
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
app.use('/index', indexRouter);
app.use('/about', aboutRouter);
app.use('/lightsToggle', lightsRouter);
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
app.use('/settings', settingsRouter);
//API Route
app.use('/state', APIRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if(err.message == "Not Found"){
    res.locals.message = "Error 404, page not found.";
    res.locals.subMessage= "Perhaps you were looking for something else?";
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

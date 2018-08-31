var weather = require('weather-js');
var config = require('../config');
var content;

getWeather = function(callback){

  //Prepare date/time for document
  var content = config.content;
  var date = new Date();
  var hours = date.getHours();
  var hoursMeridian = (hours >= 12) ? "PM" : "AM";
  var hours = (hours > 12) ? hours - 12 : hours;
  var minutes = date.getMinutes();
  if (minutes < 10)
    minutes = "0" + minutes;

  formattedTime = hours + ":" + minutes + " " + hoursMeridian;

  //Prepare weather for document - requires connection (ASYNC)
  var weatherdata;
  weather.find({search: config.location, degreeType: config.degreeType}, function(err, result) {
    if(err){
      content.location = config.location;
      content.time = date.toDateString() + ", " + formattedTime;
      content.error = "err";
      // console.log('--NO INTERNET CONNECTION--')
      callback(null, content);
    }
    else{
      weatherdata = result[0];
      content.location = config.location;
      content.time = date.toDateString() + ", " + formattedTime;
      content.weatherdata = weatherdata;
      // console.log('--CONNECTION SUCCESSFUL--')
      callback(null, content);
    }
  });
};

module.exports.getWeather = getWeather;

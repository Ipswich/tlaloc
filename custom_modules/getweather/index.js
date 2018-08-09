var weather = require('weather-js');
var config = require('../config');
var content;

getWeather = function(callback){

  //Prepare date/time for document
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
      content = {
      sidebarTitle: "Tlaloc",
      sidebarHeading: "Sprinkler Controller",
      link1: "Overview",
      link2: "Sprinklers",
      link2Sublink1: "Sprinkler 1",
      link2Sublink2: "Sprinkler 2",
      link2Sublink3: "Sprinkler 3",
      link2Sublink4: "Sprinkler 4",
      link3: "Existing Rules",
      link4: "Create Rule",
      location: config.location,
      time: date.toDateString() + ", " + formattedTime,
      error: "err"
      }
      // console.log('--NO INTERNET CONNECTION--')
      callback(null, content);
    }
    else{
      weatherdata = result[0];
      content = {
      sidebarTitle: "Tlaloc",
      sidebarHeading: "Sprinkler Controller",
      link1: "Overview",
      link2: "Sprinklers",
      link2Sublink1: "Sprinkler 1",
      link2Sublink2: "Sprinkler 2",
      link2Sublink3: "Sprinkler 3",
      link2Sublink4: "Sprinkler 4",
      link3: "Existing Rules",
      link4: "Create Rule",
      location: config.location,
      time: date.toDateString() + ", " + formattedTime,
      weatherdata: weatherdata,
      }
      // console.log('--CONNECTION SUCCESSFUL--')
      callback(null, content);
    }
  });
};

module.exports.getWeather = getWeather;

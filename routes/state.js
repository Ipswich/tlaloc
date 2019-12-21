var express = require('express');
var router = express.Router();
var getweather = require('../custom_modules/getweather');
var settings = require('../custom_modules/settings');
var five = require('johnny-five');


router.get('/', function(req, res, next) {
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      var temperature;
      var sprinkler1 = req.app.get("sprinkler1");
      var sprinkler2 = req.app.get("sprinkler2");
      var sprinkler3 = req.app.get("sprinkler3");
      var sprinkler4 = req.app.get("sprinkler4");
      var thermometer1 = req.app.get("thermometer1");
      var thermometer2 = req.app.get("thermometer2");
      var lights = req.app.get("lightsRelay");
      if (content.degreeType == 'F'){
        temperature1 = thermometer1.F + " F";
        temperature2 = thermometer2.F + " F";
        // temperature3 = thermometer3.F + " F";
        // temperature4 = thermometer4.F + " F";
      }
      else {
        temperature1 = thermometer1.C + " C";
        temperature2 = thermometer2.C + " C";
        // temperature3 = thermometer3.C + " C";
        // temperature = thermometer4.C + " C";
      }
      content.lightsOn = lights.isOn;
      //Sprinkler1 Content
      content.sprinkler1 = {};
      content.sprinkler1.name = sprinkler1.name;
      content.sprinkler1.timerObjects = sprinkler1.timerObjects;
      content.sprinkler1.wateringState = sprinkler1.wateringState;
      content.sprinkler1.fertilizeState = sprinkler1.fertilizeState;
      content.sprinkler1.temperatureState = sprinkler1.temperatureState;
      content.sprinkler1.currentTemperature = temperature1;
      content.sprinkler1.temperatureHistory = sprinkler1.getLoggedTemperatureObject();
      content.sprinkler1.highTemperature = sprinkler1.getLoggedHighTemperature();
      content.sprinkler1.lowTemperature = sprinkler1.getLoggedLowTemperature();
     //Sprinkler 2 Content
     content.sprinkler2 = {};
     content.sprinkler2.name = sprinkler2.name;
     content.sprinkler2.timerObjects = sprinkler2.timerObjects;
     content.sprinkler2.wateringState = sprinkler2.wateringState;
     content.sprinkler2.fertilizeState = sprinkler2.fertilizeState;
     content.sprinkler2.temperatureState = sprinkler2.temperatureState;
     content.sprinkler2.currentTemperature = temperature2;
     content.sprinkler2.temperatureHistory = sprinkler2.getLoggedTemperatureObject();
     content.sprinkler2.highTemperature = sprinkler2.getLoggedHighTemperature();
     content.sprinkler2.lowTemperature = sprinkler2.getLoggedLowTemperature();

      // console.log(content);
      res.json(content);
    }
  });
});

module.exports = router;

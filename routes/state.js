var express = require('express');
var router = express.Router();
var getweather = require('../custom_modules/getweather');
var settings = require('../custom_modules/settings');
var five = require('johnny-five');

var temperature;

router.get('/', function(req, res, next) {
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      var sprinkler1 = req.app.get("sprinkler1");
      var sprinkler2 = req.app.get("sprinkler2");
      var sprinkler3 = req.app.get("sprinkler3");
      var sprinkler4 = req.app.get("sprinkler4");
      var thermometer = req.app.get("thermometer");
      if (content.degreeType == 'F')
        temperature = thermometer.F + " F";
      else
        temperature = thermometer.C + " C";
      content.sprinkler1 = {}
      content.sprinkler2 = {}
      content.sprinkler3 = {}
      content.sprinkler4 = {}

      content.sprinkler1.currentTemperature = temperature;
      content.sprinkler2.currentTemperature = temperature;
      content.sprinkler3.currentTemperature = temperature;
      content.sprinkler4.currentTemperature = temperature;

      content.sprinkler1.wateringState = sprinkler1.getWateringState();
      content.sprinkler2.wateringState = sprinkler2.getWateringState();
      content.sprinkler3.wateringState = sprinkler3.getWateringState();
      content.sprinkler4.wateringState = sprinkler4.getWateringState();

      content.sprinkler1.temperatureState = sprinkler1.getTemperatureState();
      content.sprinkler2.temperatureState = sprinkler2.getTemperatureState();
      content.sprinkler3.temperatureState = sprinkler3.getTemperatureState();
      content.sprinkler4.temperatureState = sprinkler4.getTemperatureState();

      res.json(content);
    }
  });
});

module.exports = router;

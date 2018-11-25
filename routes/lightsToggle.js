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
      var thermometer = req.app.get("thermometer");
      var lights = req.app.get("lightsRelay");
      if (content.degreeType == 'F')
        temperature = thermometer.F + " F";
      else
        temperature = thermometer.C + " C";
      console.log(lights.isOn)
      console.log("LIGHTS TOGGLED");
      lights.toggle();
      content.lights = lights;
      content.sprinkler1 = {};
      content.sprinkler2 = {};
      content.sprinkler3 = {};
      content.sprinkler4 = {};

      content.sprinkler1.currentTemperature = temperature;
      content.sprinkler2.currentTemperature = temperature;
      content.sprinkler3.currentTemperature = temperature;
      content.sprinkler4.currentTemperature = temperature;

      content.sprinkler1.wateringState = sprinkler1.getWateringState();
      content.sprinkler2.wateringState = sprinkler2.getWateringState();
      content.sprinkler3.wateringState = sprinkler3.getWateringState();
      content.sprinkler4.wateringState = sprinkler4.getWateringState();

      sprinkler1.heaterRelay.isOn ? sprinkler1.setTemperatureState(1) : sprinkler1.setTemperatureState(0);
      sprinkler2.heaterRelay.isOn ? sprinkler2.setTemperatureState(1) : sprinkler2.setTemperatureState(0);
      sprinkler3.heaterRelay.isOn ? sprinkler3.setTemperatureState(1) : sprinkler3.setTemperatureState(0);
      sprinkler4.heaterRelay.isOn ? sprinkler4.setTemperatureState(1) : sprinkler4.setTemperatureState(0);

      sprinkler1.coolerRelay.isOn ? sprinkler1.setTemperatureState(-1) : sprinkler1.setTemperatureState(0);
      sprinkler2.coolerRelay.isOn ? sprinkler2.setTemperatureState(-1) : sprinkler2.setTemperatureState(0);
      sprinkler3.coolerRelay.isOn ? sprinkler3.setTemperatureState(-1) : sprinkler3.setTemperatureState(0);
      sprinkler4.coolerRelay.isOn ? sprinkler4.setTemperatureState(-1) : sprinkler4.setTemperatureState(0);

      content.sprinkler1.temperatureState = sprinkler1.getTemperatureState();
      content.sprinkler2.temperatureState = sprinkler2.getTemperatureState();
      content.sprinkler3.temperatureState = sprinkler3.getTemperatureState();
      content.sprinkler4.temperatureState = sprinkler4.getTemperatureState();

      res.render('./index', content);
    }
  });
});

module.exports = router;

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
      // var thermometer2 = req.app.get("thermometer2");
      // var thermometer3 = req.app.get("thermometer3")
      // var thermometer4 = req.app.get("thermometer4")
      var lights = req.app.get("lightsRelay");
      lights.toggle();
      // console.log(lights.isOn);
      if (content.degreeType == 'F'){
        temperature1 = thermometer1.F + " F";
        // temperature2 = thermometer2.F + " F";
        // temperature3 = thermometer3.F + " F";
        // temperature4 = thermometer4.F + " F";
      }
      else {
        temperature1 = thermometer1.C + " C";
        // temperature2 = thermometer2.C + " C";
        // temperature3 = thermometer3.C + " C";
        // temperature4 = thermometer4.C + " C";
      }
      content.lights = lights;
      content.sprinkler1 = sprinkler1;
      content.sprinkler2 = sprinkler2;
      content.sprinkler3 = sprinkler3;
      content.sprinkler4 = sprinkler4;

      content.sprinkler1.currentTemperature = temperature1;
      // content.sprinkler2.currentTemperature = temperature2;
      // content.sprinkler3.currentTemperature = temperature;
      // content.sprinkler4.currentTemperature = temperature;

      content.sprinkler1.wateringState = sprinkler1.getWateringState();
      content.sprinkler2.wateringState = sprinkler2.getWateringState();
      content.sprinkler3.wateringState = sprinkler3.getWateringState();
      content.sprinkler4.wateringState = sprinkler4.getWateringState();

      sprinkler1.heaterRelay.isOn ? sprinkler1.setTemperatureState(1) : sprinkler1.setTemperatureState(0);
      sprinkler2.heaterRelay.isOn ? sprinkler2.setTemperatureState(1) : sprinkler2.setTemperatureState(0);
      sprinkler3.heaterRelay.isOn ? sprinkler3.setTemperatureState(1) : sprinkler3.setTemperatureState(0);
      sprinkler4.heaterRelay.isOn ? sprinkler4.setTemperatureState(1) : sprinkler4.setTemperatureState(0);

      if(sprinkler1.heaterRelay.isOn != true)
        sprinkler1.coolerRelay.isOn ? sprinkler1.setTemperatureState(-1) : sprinkler1.setTemperatureState(0);
      if(sprinkler2.heaterRelay.isOn != true)
        sprinkler2.coolerRelay.isOn ? sprinkler2.setTemperatureState(-1) : sprinkler2.setTemperatureState(0);
      if(sprinkler3.heaterRelay.isOn != true)
        sprinkler3.coolerRelay.isOn ? sprinkler3.setTemperatureState(-1) : sprinkler3.setTemperatureState(0);
      if(sprinkler4.heaterRelay.isOn != true)
        sprinkler4.coolerRelay.isOn ? sprinkler4.setTemperatureState(-1) : sprinkler4.setTemperatureState(0);

      content.sprinkler1.temperatureState = sprinkler1.getTemperatureState();
      content.sprinkler2.temperatureState = sprinkler2.getTemperatureState();
      content.sprinkler3.temperatureState = sprinkler3.getTemperatureState();
      content.sprinkler4.temperatureState = sprinkler4.getTemperatureState();

      content.sprinkler1.temperatureData = sprinkler1.getLoggedTemperatureObject();
      content.sprinkler1.highTemperature = sprinkler1.getLoggedHighTemperature();
      content.sprinkler1.lowTemperature = sprinkler1.getLoggedLowTemperature();

      content.sprinkler2.temperatureData = sprinkler2.getLoggedTemperatureObject();
      content.sprinkler2.highTemperature = sprinkler2.getLoggedHighTemperature();
      content.sprinkler2.lowTemperature = sprinkler2.getLoggedLowTemperature();

      content.sprinkler3.temperatureData = sprinkler3.getLoggedTemperatureObject();
      content.sprinkler3.highTemperature = sprinkler3.getLoggedHighTemperature();
      content.sprinkler3.lowTemperature = sprinkler3.getLoggedLowTemperature();

      content.sprinkler4.temperatureData = sprinkler4.getLoggedTemperatureObject();
      content.sprinkler4.highTemperature = sprinkler4.getLoggedHighTemperature();
      content.sprinkler4.lowTemperature = sprinkler4.getLoggedLowTemperature();

      res.redirect('back');
    }
  });
});

module.exports = router;

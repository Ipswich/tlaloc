var express = require('express');
var router = express.Router();
var getweather = require('../custom_modules/getweather');
var settings = require('../custom_modules/settings')

router.get('/', function(req, res, next) {
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {

      sprinkler1 = req.app.get("sprinkler1")
      sprinkler2 = req.app.get("sprinkler2")
      sprinkler3 = req.app.get("sprinkler3")
      sprinkler4 = req.app.get("sprinkler4")

      content.sprinkler1 = {}
      content.sprinkler2 = {}
      content.sprinkler3 = {}
      content.sprinkler4 = {}

      content.sprinkler1.currentTemperature = sprinkler1.getTemperatureFromProbe();
      content.sprinkler2.currentTemperature = sprinkler2.getTemperatureFromProbe();
      content.sprinkler3.currentTemperature = sprinkler3.getTemperatureFromProbe();
      content.sprinkler4.currentTemperature = sprinkler4.getTemperatureFromProbe();

      content.sprinkler1.wateringState = sprinkler1.getWateringState();
      content.sprinkler2.wateringState = sprinkler2.getWateringState();
      content.sprinkler3.wateringState = sprinkler3.getWateringState();
      content.sprinkler4.wateringState = sprinkler4.getWateringState();

      content.sprinkler1.temperatureState = sprinkler1.getTemperatureState();
      content.sprinkler2.temperatureState = sprinkler2.getTemperatureState();
      content.sprinkler3.temperatureState = sprinkler3.getTemperatureState();
      content.sprinkler4.temperatureState = sprinkler4.getTemperatureState();

      res.render('./index', content);
    }
  });
});

module.exports = router;

var express = require('express');
var body = require('body-parser');
var router = express.Router();
var getweather = require('../custom_modules/getweather');
var sprinkler = require('../custom_modules/sprinkler');
var settings = require('../custom_modules/settings');

var urlencodedParser = body.urlencoded({ extended: false });

var content = settings.settingsFunctions.getSettingsData();
/* GET sprinkler3. */
router.get('/', function(req, res, next) {
  // scheduledata = req.app.get('sprinkler3');
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      content.sprinkler = req.app.get('sprinkler3');
      content.Cooling = content.sprinkler.getCoolTemperature();
      content.Heating = content.sprinkler.getHeatTemperature();
      res.render('./temperature', content);
    }
  });
});

router.post('/', urlencodedParser, function(req, res, next){
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      content.sprinkler = req.app.get('sprinkler3')

      var coolstate = (req.body.coolTempCheckbox == "on") ? true : false;
      var heatstate = (req.body.heatTempCheckbox == "on") ? true : false;
      content.sprinkler.setCoolTemperature(req.body.CoolTemperature, coolstate);
      content.sprinkler.setHeatTemperature(req.body.HeatTemperature, heatstate);
      content.Cooling = content.sprinkler.getCoolTemperature();
      content.Heating = content.sprinkler.getHeatTemperature();
      res.render('./temperature', content);
    }
  });

});

module.exports = router;

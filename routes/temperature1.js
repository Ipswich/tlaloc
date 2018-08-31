var express = require('express');
var body = require('body-parser');
var router = express.Router();
var getweather = require('../custom_modules/getweather');
var sprinkler = require('../custom_modules/sprinkler');
var config = require('../custom_modules/config');

var urlencodedParser = body.urlencoded({ extended: false });

/* GET sprinkler1. */
router.get('/', function(req, res, next) {
  // scheduledata = req.app.get('sprinkler1');
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      content.degreeType = config.degreeType;
      content.sprinkler = req.app.get('sprinkler1');
      content.Cooling = content.sprinkler.getCoolTemperature();
      content.Heating = content.sprinkler.getHeatTemperature();

      console.log(content.Heating)
      res.render('./temperature', content);
    }
  });
});

router.post('/', urlencodedParser, function(req, res, next){
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      content.degreeType = config.degreeType;
      content.sprinkler = req.app.get('sprinkler1');
      content.Cooling = content.sprinkler.getCoolTemperature();
      content.Heating = content.sprinkler.getHeatTemperature();
      console.log(content);
      if (req.body.formName == "cooltemperaturerule"){
        var coolstate = (req.body.coolTempCheckbox == "on") ? true : false;
        content.sprinkler.setCoolTemperature(req.body.CoolTemperature, coolstate);
        content.Cooling = content.sprinkler.getCoolTemperature();
        res.render('./temperature', content);
      }
      if (req.body.formName == "heattemperaturerule"){
        var heatstate = (req.body.heatTempCheckbox == "on") ? true : false;
        content.sprinkler.setHeatTemperature(req.body.HeatTemperature, heatstate);
        content.Heating = content.sprinkler.getHeatTemperature();
        res.render('./temperature', content);
      }
    }
  });

});

module.exports = router;

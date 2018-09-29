var express = require('express');
var body = require('body-parser');
var router = express.Router();
var getweather = require('../custom_modules/getweather');
var sprinkler = require('../custom_modules/sprinkler');
var settings = require('../custom_modules/settings');

var urlencodedParser = body.urlencoded({ extended: false });

/* GET sprinkler3. */
router.get('/', function(req, res, next) {
  // scheduledata = req.app.get('sprinkler3');
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      content.degreeType = settings.degreeType;
      content.sprinkler = req.app.get('sprinkler3');
      content.Cooling = content.sprinkler.getCoolTemperature();
      res.render('./sprinkler', content);
    }
  });
});

router.post('/', urlencodedParser, function(req, res, next){
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      content.degreeType = settings.degreeType;
      content.sprinkler = req.app.get('sprinkler3');
      content.Cooling = content.sprinkler.getCoolTemperature();
      if (req.body.formName == "newrule"){
        var startString = sprinkler.inputParser(req.body.Startminute, req.body.Starthour, req.body.StartdayOfMonth, req.body.Startmonth, req.body.StartdayOfWeek);
        var stopString = sprinkler.inputParser(req.body.Stopminute, req.body.Stophour, req.body.StopdayOfMonth, req.body.Stopmonth, req.body.StopdayOfWeek);
        (req.body.fertilizeCheckbox == undefined) ? fertilize = false : fertilize = true;
        content.sprinkler.addTimer(startString, stopString, fertilize)
        content.sprinkler.cancelAllTimers();
        content.sprinkler.commitAllTimers();
        res.render('./sprinkler', content);
      }
      else if (req.body.formName == "removerule"){
        for(let i = Object.entries(req.body).length - 1; i > 0; i--){
          content.sprinkler.removeTimerByIndex(Object.entries(req.body)[i][0].slice(6));
        }
        content.sprinkler.cancelAllTimers();
        content.sprinkler.commitAllTimers();
        res.render('./sprinkler', content);
      }
    }
  });

});

module.exports = router;

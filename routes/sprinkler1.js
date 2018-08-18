var express = require('express');
var body = require('body-parser');
var router = express.Router();
var getweather = require('../custom_modules/getweather');
var sprinkler = require('../custom_modules/sprinkler');

var urlencodedParser = body.urlencoded({ extended: false });

/* GET sprinkler1. */
router.get('/', function(req, res, next) {
  // scheduledata = req.app.get('sprinkler1');
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      content.sprinkler = req.app.get('sprinkler1')
      console.log(content)
      // console.log(content.scheduledata);
      res.render('./sprinkler', content);
    }
  });
});

router.post('/', urlencodedParser, function(req, res, next){
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {

      var startString = req.app.sprinkler1.inputParser(req.body.Startminute, req.body.Starthour, req.body.StartdayOfMonth, req.body.Startmonth, req.body.StartdayOfWeek);
      var stopString = req.app.sprinkler1.inputParser(req.body.Stopminute, req.body.Stophour, req.body.StopdayOfMonth, req.body.Stopmonth, req.body.StopdayOfWeek);
      var fertilize = req.body.fertilizeCheckbox;

      console.log(startString);
      console.log(stopString);
      console.log(fertilize);

      content.scheduledata = req.app.get('sprinkler1').getSchedule();
      console.log(content)
      // console.log(content.scheduledata);
      res.render('./sprinkler', content);
    }
  });

});

module.exports = router;

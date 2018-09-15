var express = require('express');
var router = express.Router();
var getweather = require('../custom_modules/getweather');

router.get('/', function(req, res, next) {
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      content.sprinkler1Functions = req.app.get('sprinkler1');
      content.sprinkler2Functions = req.app.get('sprinkler2');
      content.sprinkler3Functions = req.app.get('sprinkler3');
      content.sprinkler4Functions = req.app.get('sprinkler4');
      res.render('./index', content);
    }
  });
});

module.exports = router;

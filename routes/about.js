var express = require('express');
var router = express.Router();
var getweather = require('../custom_modules/getweather');

/* GET users listing. */
router.get('/', function(req, res, next) {
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else res.render('./about', content);
  });
});

module.exports = router;

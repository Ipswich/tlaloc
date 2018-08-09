var express = require('express');
var router = express.Router();
var getweather = require('../custom_modules/getweather');
var sprinkler = require('../custom_modules/sprinkler');


var sprinkler1 = new sprinkler.CreateSprinkler('sprinkler1', 8);
var sprinkler2 = new sprinkler.CreateSprinkler('sprinkler2', 9);
// sprinkler1.addTimer('* * * * * *', '* * * * * *');
// sprinkler1.addTimer('* * * * * *', '* * * * * *');
// console.log(sprinkler1.getTimerByIndex(0));
// sprinkler1.removeTimerByIndex(0);
// console.log(sprinkler1.getTimerByIndex(0));
console.log(sprinkler1.getTimerByIndex(0));
sprinkler1.addTimer('* * * * * *', '* * * * * *');
console.log(sprinkler1.getTimerByIndex(0));
sprinkler1.commitAllTimers();
setTimeout(function(){
  sprinkler1.cancelAllTimers()
  sprinkler1.removeTimerByIndex(0)
  console.log(sprinkler1.getTimerByIndex(0))
}, 5000);


/* GET createrule. */
router.get('/', function(req, res, next) {
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      res.render('./createrule', content);
    }
  });
});

module.exports = router;

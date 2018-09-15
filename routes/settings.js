var express = require('express');
var router = express.Router();
var getweather = require('../custom_modules/getweather');
var settings = require('../custom_modules/settings');

/* GET about. */
router.get('/', function(req, res, next) {
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      console.log(content)
      res.render('./settings', content);
    }
  });
});

router.post('/', function(req, res, next) {
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      var sprinkler1 = req.app.get("sprinkler1");
      var sprinkler2 = req.app.get("sprinkler2");
      var sprinkler3 = req.app.get("sprinkler3");
      var sprinkler4 = req.app.get("sprinkler4");

      //////////////////
      //Zone1 Settings//
      //////////////////
      //Name
      settings.settingsFunctions.setlink1name(req.body.zone1);
      //Watering
      if(req.body.waterVis1 == "true"){
        if(sprinkler1.timerObjects.length == 0)
        {
          sprinkler1.commitAllTimers();
        }
        settings.settingsFunctions.setlink1watering(true);
      }
      else{
        sprinkler1.offWatering();
        if(sprinkler1.fertilizeState == 1){
          sprinkler1.offFertilize();
        }
        sprinkler1.cancelAllTimers();
        settings.settingsFunctions.setlink1watering(false);
      }
      //Temperature
      if(req.body.tempVis1 == "true"){
        sprinkler1.setHeatStatus = true;
        sprinkler1.setCoolStatus = true;
        settings.settingsFunctions.setlink1temperature(true)
      }
      else{
        sprinkler1.setHeatStatus = false;
        sprinkler1.setCoolStatus = false;
        settings.settingsFunctions.setlink1temperature(false)
      }

      //////////////////
      //Zone2 Settings//
      //////////////////
      //Name
      settings.settingsFunctions.setlink2name(req.body.zone2);
      //Watering
      if(req.body.waterVis2 == "true"){
        if(sprinkler2.timerObjects.length == 0)
        {
          sprinkler2.commitAllTimers();
        }
        settings.settingsFunctions.setlink2watering(true)
      }
      else{
        sprinkler2.offWatering();
        if(sprinkler2.fertilizeState == 1){
          sprinkler2.offFertilize();
        }
        sprinkler2.cancelAllTimers();
        settings.settingsFunctions.setlink2watering(false)
      }
      //Temperature
      if(req.body.tempVis2 == "true"){
        sprinkler2.setHeatStatus = true;
        sprinkler2.setCoolStatus = true;
        settings.settingsFunctions.setlink2temperature(true)
      }
      else{
        sprinkler2.setHeatStatus = false;
        sprinkler2.setCoolStatus = false;
        settings.settingsFunctions.setlink2temperature(false)
      }

      //////////////////
      //Zone3 Settings//
      //////////////////
      //Name
      settings.settingsFunctions.setlink3name(req.body.zone3);
      //Watering
      if(req.body.waterVis3 == "true"){
        if(sprinkler3.timerObjects.length == 0)
        {
          sprinkler3.commitAllTimers();
        }
        settings.settingsFunctions.setlink3watering(true)
      }
      else{
        sprinkler3.offWatering();
        if(sprinkler3.fertilizeState == 1){
          sprinkler3.offFertilize();
        }
        sprinkler3.cancelAllTimers();
        settings.settingsFunctions.setlink3watering(false)
      }
      //Temperature
      if(req.body.tempVis3 == "true"){
        sprinkler3.setHeatStatus = true;
        sprinkler3.setCoolStatus = true;
        settings.settingsFunctions.setlink3temperature(true)
      }
      else{
        sprinkler3.setHeatStatus = false;
        sprinkler3.setCoolStatus = false;
        settings.settingsFunctions.setlink3temperature(false)
      }

      //////////////////
      //Zone4 Settings//
      //////////////////
      //Name
      settings.settingsFunctions.setlink4name(req.body.zone4);
      //Watering
      if(req.body.waterVis4 == "true"){
        if(sprinkler4.timerObjects.length == 0)
        {
          sprinkler4.commitAllTimers();
        }
        settings.settingsFunctions.setlink4watering(true)
      }
      else{
        sprinkler4.offWatering();
        if(sprinkler4.fertilizeState == 1){
          sprinkler4.offFertilize();
        }
        sprinkler4.cancelAllTimers();
        settings.settingsFunctions.setlink4watering(false)
      }
      //Temperature
      if(req.body.tempVis4 == "true"){
        sprinkler4.setHeatStatus = true;
        sprinkler4.setCoolStatus = true;
        settings.settingsFunctions.setlink4temperature(true)
      }
      else{
        sprinkler4.setHeatStatus = false;
        sprinkler4.setCoolStatus = false;
        settings.settingsFunctions.setlink4temperature(false)
      }
      res.render('./settings', content);
    }
  });
});

module.exports = router;

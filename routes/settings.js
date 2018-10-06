var express = require('express');
var router = express.Router();
var getweather = require('../custom_modules/getweather');
var settings = require('../custom_modules/settings');

/* GET about. */
router.get('/', function(req, res, next) {
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      res.render('./settings', content);
    }
  });
});

router.post('/', function(req, res, next) {
  //Load sprinklers for functions
  var sprinkler1 = req.app.get("sprinkler1");
  var sprinkler2 = req.app.get("sprinkler2");
  var sprinkler3 = req.app.get("sprinkler3");
  var sprinkler4 = req.app.get("sprinkler4");

  //Apply Radio button value to Database
  settings.settingsFunctions.setDegreeType(req.body.degreeTypeRadio);

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
    settings.settingsFunctions.setsprinkler1watering(true);
  }
  else{
    sprinkler1.offWatering(this);
    if(sprinkler1.fertilizeState == 1){
      sprinkler1.offFertilize(this);
    }
    sprinkler1.cancelAllTimers();
    settings.settingsFunctions.setsprinkler1watering(false);
  }
  //Temperature
  if(req.body.tempVis1 == "true"){
    sprinkler1.setHeatEnableState = true;
    sprinkler1.setCoolEnableState = true;
    settings.settingsFunctions.setsprinkler1temperature(true)
  }
  else{
    sprinkler1.setHeatEnableState = false;
    sprinkler1.setCoolEnableState = false;
    settings.settingsFunctions.setsprinkler1temperature(false)
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
    settings.settingsFunctions.setsprinkler2watering(true)
  }
  else{
    sprinkler2.offWatering(this);
    if(sprinkler2.fertilizeState == 1){
      sprinkler2.offFertilize(this);
    }
    sprinkler2.cancelAllTimers();
    settings.settingsFunctions.setsprinkler2watering(false)
  }
  //Temperature
  if(req.body.tempVis2 == "true"){
    sprinkler2.setHeatEnableState = true;
    sprinkler2.setCoolEnableState = true;
    settings.settingsFunctions.setsprinkler2temperature(true)
  }
  else{
    sprinkler2.setHeatEnableState = false;
    sprinkler2.setCoolEnableState = false;
    settings.settingsFunctions.setsprinkler2temperature(false)
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
    settings.settingsFunctions.setsprinkler3watering(true)
  }
  else{
    sprinkler3.offWatering(this);
    if(sprinkler3.fertilizeState == 1){
      sprinkler3.offFertilize(this);
    }
    sprinkler3.cancelAllTimers();
    settings.settingsFunctions.setsprinkler3watering(false)
  }
  //Temperature
  if(req.body.tempVis3 == "true"){
    sprinkler3.setHeatEnableState = true;
    sprinkler3.setCoolEnableState = true;
    settings.settingsFunctions.setsprinkler3temperature(true)
  }
  else{
    sprinkler3.setHeatEnableState = false;
    sprinkler3.setCoolEnableState = false;
    settings.settingsFunctions.setsprinkler3temperature(false)
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
    settings.settingsFunctions.setsprinkler4watering(true)
  }
  else{
    sprinkler4.offWatering(this);
    if(sprinkler4.fertilizeState == 1){
      sprinkler4.offFertilize(this);
    }
    sprinkler4.cancelAllTimers();
    settings.settingsFunctions.setsprinkler4watering(false)
  }
  //Temperature
  if(req.body.tempVis4 == "true"){
    sprinkler4.setHeatEnableState = true;
    sprinkler4.setCoolEnableState = true;
    settings.settingsFunctions.setsprinkler4temperature(true)
  }
  else{
    sprinkler4.setHeatEnableState = false;
    sprinkler4.setCoolEnableState = false;
    settings.settingsFunctions.setsprinkler4temperature(false)
  }
  getweather.getWeather(function(err, content){
    if (err) console.log(err);
    else {
      res.render('./settings', content);
    }
  });
});

module.exports = router;

const schedule = require('node-schedule');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const settings = require('../settings')
const five = require('johnny-five');

//depricated
const Gpio = require('onoff').Gpio

//Parses input into string for timers
function inputParser(minute, hour, dayOfMonth, month, dayOfWeek){
  let outputString = ("0 " + minute + " " + hour + " " + dayOfMonth + " * " + dayOfWeek)
  return outputString;
}

function Sprinkler(name, sprinklerRelay, fertilizeRelay, heaterRelay, arduino, thermometer){
  this.name = name;
  this.timerObjects = [];
  this.fertilizeRelay = fertilizeRelay;
  this.heaterRelay = heaterRelay;
  this.wateringState = 0;
  this.fertilizeState = 0;
  this.temperatureState = "Off";
  this.thermometer = thermometer;
  this.sprinklerRelay = new five.Relay(sprinklerRelay);

  console.log(this.name + ' uses Arduino pin: ' +  sprinklerRelay);
}
    //////////////////////////
    //LOW DB STORAGE METHODS//
    //////////////////////////
    //Returns the entire array of start/stop pairs
    Sprinkler.prototype.getSchedule = function(){
      db.read();
      if(db.has(this.name).value()){
        return db.get(this.name).value();
      }
      else {
        console.log("NO SCHEDULE")
      }
    }

    //Returns the pair of start/stop times by index
    Sprinkler.prototype.getTimerByIndex = function(index){
      db.read();
      let string = this.name + '[' + index + ']';
      if(db.has(string).value()){
        return db.get(string).value();
      }
      else{
        console.log("NO TIMERS");
      }
    }

    //Adds a timer to the database
    Sprinkler.prototype.addTimer = function(startString, stopString, fertilize){
      console.log("ADDING ENTRY. . .");
      db.get(this.name).push({startTime: startString, stopTime: stopString, fertilizeState: fertilize}).write();
    }

    //Removes a timer from the database by index
    Sprinkler.prototype.removeTimerByIndex = function(index){
      let string = this.name + '[' + index + ']';
      if(db.has(string).value()) {
        console.log("REMOVING ENTRY . . .")
        db.set(string, {removeMe: 1}).write();
        db.get(this.name).remove({removeMe: 1}).write();
      }
      else {
        console.log("NO TIMER TO DELETE");
      }
    }

    ////////////////////////
    //SCHEDULING FUNCTIONS//
    ////////////////////////
    //Activate all timers and add returned objects to timerObjects array.
    //Commits entries from DB into the app, filling the timer array
    Sprinkler.prototype.commitAllTimers = function(){
      let sprinkler = this;
      let list = this.getSchedule();
      let length = list.length;
      for(let i = 0; i < length; i++){
        if(list[i].fertilizeState == false){
          this.timerObjects.push(schedule.scheduleJob(list[i].startTime, ()=>{sprinkler.onWatering(sprinkler)}));
          this.timerObjects.push(schedule.scheduleJob(list[i].stopTime, ()=>{sprinkler.offWatering(sprinkler)}));
        }
        else{
          this.timerObjects.push(schedule.scheduleJob(list[i].startTime, ()=>{sprinkler.onFertilize(sprinkler)}));
          this.timerObjects.push(schedule.scheduleJob(list[i].stopTime, ()=>{sprinkler.offFertilize(sprinkler)}));
        }
      }
    }

    //Cancel all timers and clear timerObjects array
    Sprinkler.prototype.cancelAllTimers = function(){
      let length = this.timerObjects.length;
      for(let i = 0; i < length; i++){
        this.timerObjects[i].cancel();
      }
      this.timerObjects = [];
    }

    ////////////////////
    ////DATA GETTERS////
    ////////////////////

    //Returns the current state of watering
    Sprinkler.prototype.getWateringState = function(){
      return this.wateringState
    }

    //Returns the current state of fertilize
    Sprinkler.prototype.getFertilizeState = function(){
      return this.fertilizeState;
    }

    //Returns the current state of heating/cooling
    Sprinkler.prototype.getTemperatureState = function(){
      return this.temperatureState;
    }

    //Get Enable/disable state from database.
    Sprinkler.prototype.getTemperatureEnableState = function(){
      db.read();
      return db.get("settings.toggles." + this.name + "temperature").cloneDeep().value();
    }

    Sprinkler.prototype.getWateringEnableState = function(){
      db.read();
      return db.get("settings.toggles." + this.name + "watering").cloneDeep().value();
    }

    //Returns the threshold for turning on the heating, and whether or not it is enabled.
    Sprinkler.prototype.getHeatTemperature = function(){
      db.read();
      return db.get(this.name + "HeatTemp").cloneDeep().value();
    }

    //Returns the threshold for turning on the cooling, and whether or not it is enabled.
    Sprinkler.prototype.getCoolTemperature = function(){
      db.read();
      return db.get(this.name + "CoolTemp").cloneDeep().value();
    }


    ////////////////////
    ////DATA SETTERS////
    ////////////////////
    Sprinkler.prototype.setWateringState = function(val){
      this.wateringState = val;
    }

    //Sets the threshold for turning on heating, and whether or not it is enabled.
    //Stores info in the DB
    Sprinkler.prototype.setHeatTemperature = function(value, checkbox){
      db.set(this.name + "HeatTemp",  {heatTemp: value, state: checkbox}).write();
    }

    //Sets the threshold for turning on cooling, and whether or not it is enabled.
    //Stores info in the DB.
    Sprinkler.prototype.setCoolTemperature = function(value, checkbox){
      db.set(this.name + "CoolTemp",  {coolTemp: value, state: checkbox}).write();
    }

    Sprinkler.prototype.setTemperatureEnableState = function(value){
      db.set("settings.toggles." + this.name + "temperature", val).write();
    }

    ////////////////////
    //ON-OFF FUNCTIONS//
    ////////////////////
    //Function for turning on watering
    Sprinkler.prototype.onWatering = function(val){
      val.wateringState = 1;
      val.sprinklerRelay.on();
      console.log(val.name + ": Watering ON");
    }

    //Function for turning off watering
    Sprinkler.prototype.offWatering = function(val){
      console.log("HERE" + val)
      val.wateringState = 0;
      val.sprinklerRelay.off();
      console.log(val.name + ": Watering OFF");
    }

    //Function for turning on fertilizer
    Sprinkler.prototype.onFertilize = function(val){
      // console.log(val.fertilizeRelay);
      val.sprinklerRelay.on();
      val.fertilizeState = 1;
      val.fertilizeRelay.on();
      console.log(val.name + ": Fertilize ON");
    }

      //Function for turning off fertilizer
    Sprinkler.prototype.offFertilize = function(val){
      val.sprinklerRelay.off();
      val.fertilizeState = 0;
      val.fertilizeRelay.off();
      console.log(val.name + ": Fertilize OFF");
    }

    //Function for turning on cooling by sprinklers (Should not override watering)
    Sprinkler.prototype.onCooling = function(){
      this.sprinklerRelay.on();
      // console.log(this.name + ": Cooling ON");
    }

    //Function for turning off cooling by sprinklers (Should not override watering)
    Sprinkler.prototype.offCooling = function(){
      this.sprinklerRelay.off();
      // console.log(this.name + ": Cooling OFF");
    }

    //Function for turning on heater
    Sprinkler.prototype.onHeating = function(){
      this.heaterRelay.on();
      console.log(this.name + ": Heating ON");
    }

    //Function for turning on heater
    Sprinkler.prototype.offHeating = function(){
        this.fertilizeRelay.off();
        console.log(this.name + ": Heating OFF");

    }


    ////////////////////////////
    //TEMPERATURE SENSOR STUFF//
    ////////////////////////////
    //Get temperature data from probe, returns temperature based on degreeType specified in the settings file.
    Sprinkler.prototype.getTemperatureFromProbe = function(){
      if (settings.degreeType = 'F'){
        return this.thermometer.F;
      }
      else {
        return this.thermometer.C;
      }
    }


      /*Checks whether or not cooling should be turned on or off.
      Looks at if the control is enabled, if temperature meets cutoff, and if cooling is turned on.*/
      Sprinkler.prototype.temperatureCoolTask = function(probeTemp){
      var data = this.getCoolTemperature();
      var enableState = this.getTemperatureEnableState();
      if (data.state == true && enableState == true && parseInt(probeTemp) >= parseInt(data.coolTemp)){
        this.temperatureState = "Cooling"
        this.onCooling();
      }
      if ((this.wateringState == 0 && probeTemp < data.coolTemp) || (this.wateringState == 0 && data.state == false) || (enableState == false)){
        this.temperatureState = "Off"
        this.offCooling();
      }
    }

    /*Checks whether or not heating should be turned on or off. Looks at on/off state of the zone as well.
    Looks at if the control is enabled, if temperature meets cutoff, and if cooling is turned on.*/
    Sprinkler.prototype.temperatureHeatTask = function(probeTemp){
      var data = this.getHeatTemperature();
      var enableState = this.getTemperatureEnableState();
      if (data.state == true && enableState == true && parseInt(probeTemp) <= parseInt(data.heatTemp)){
        this.temperatureState = "Heating"
        this.onHeating();
      }
      if ((probeTemp > data.heatTemp) || (data.state == false) || (enableState == false)) {
        this.temperatureState = "Off"
        this.offHeating();
      }
    }

module.exports = Sprinkler;
module.exports.inputParser = inputParser;

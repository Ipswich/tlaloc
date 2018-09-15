const schedule = require('node-schedule');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const settings = require('../settings')
const Gpio = require('onoff').Gpio
const ds18b20 = require('ds18b20');


//Load sensor IDs into array for access
var sensorIDs = ds18b20.sensors(function(err, ids) {
  if (err){
    console.log(err)
  }
  else
    return ids;
});


Sprinkler = {
  //Parses input into string for timers
  inputParser: (minute, hour, dayOfMonth, month, dayOfWeek) => {
    let outputString = ("0 " + minute + " " + hour + " " + dayOfMonth + " * " + dayOfWeek)
    return outputString;
  },

  //Constructor method for creating a sprinkler device.
  CreateSprinkler: function(name, gpioPin, fertilizePin){
    this.name = name;
    this.gpioPin = gpioPin;
    this.timerObjects = [];
    this.fertilizePin = fertilizePin;
    this.wateringState = 0;
    this.fertilizeState = 0;
    this.temperatureState = "Off";

    //Set Pin if GPIO hardware exists
    if (Gpio.accessible) {
      var pin = new Gpio(this.gpioPin, 'out')
    } else {
        console.log('Virtual sprinkler now uses value: ' + this.gpioPin);
    }

    //Createthis sprinkler DB if the database hasn't been previously created.
    if(!db.has(this.name).value())
    {
      db.set(name, []).write();
      db.set(name+"CoolTemp", {}).write();
      db.set(name+"HeatTemp", {}).write();
    }

    //////////////////////////
    //LOW DB STORAGE METHODS//
    //////////////////////////
    //Returns the entire array of start/stop pairs
    this.getSchedule = function(){
      if(db.has(this.name).value()){
        return db.get(this.name).value();
      }
      else {
        console.log("NO SCHEDULE")
      }
    }

    //Returns the pair of start/stop times by index
    this.getTimerByIndex = function(index){
      let string = this.name + '[' + index + ']';
      if(db.has(string).value()){
        return db.get(string).value();
      }
      else{
        console.log("NO TIMERS");
      }
    }

    //Adds a timer to the database
    this.addTimer = function(startString, stopString, fertilize){
      console.log("ADDING ENTRY. . .");
      db.get(this.name).push({startTime: startString, stopTime: stopString, fertilizeState: fertilize}).write();
    }

    //Removes a timer from the database by index
    this.removeTimerByIndex = function(index){
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
    this.commitAllTimers = function(){
      let list = this.getSchedule();
      let length = list.length;
      for(let i = 0; i < length; i++){
        if(list[i].fertilizeState == false){
          this.timerObjects.push(schedule.scheduleJob(list[i].startTime, this.onWatering));
          this.timerObjects.push(schedule.scheduleJob(list[i].stopTime, this.offWatering));
        }
        else{
          this.timerObjects.push(schedule.scheduleJob(list[i].startTime, this.onFertilize));
          this.timerObjects.push(schedule.scheduleJob(list[i].stopTime, this.offFertilize));
        }
      }
    }

    //Cancel all timers and clear timerObjects array
    this.cancelAllTimers = function(){
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
    this.getWateringState = function(){
      return this.wateringState
    }

    //Returns the current state of fertilize
    this.getFertilizeState = function(){
      return this.fertilizeState;
    }

    //Returns the current state of heating/cooling
    this.getTemperatureState = function(){
      return this.temperatureState;
    }


    ////////////////////
    //ON-OFF FUNCTIONS//
    ////////////////////

    //Function for turning on watering
    this.onWatering = function(){
      this.wateringState = 1;
      if(Gpio.accessible && pin != undefined) {
        pin.writeSync(1);
        process.on('SIGINT', () => {
          pin.unexport();
        });
      }
      else {
        console.log(this.name + ": Watering ON")
      }
    }

    //Function for turning off watering
    this.offWatering = function(){
      this.wateringState = 0;
      if(Gpio.accessible && pin != undefined) {
        pin.writeSync(0);
        process.on('SIGINT', () => {
          pin.unexport();
        });
      }
      else {
        console.log(this.name + ": Watering OFF")
      }
    }

    //Function for turning on cooling by sprinklers (Should not override watering)
    this.onCooling = function(){
      if(Gpio.accessible && pin != undefined) {
        pin.writeSync(1);
        process.on('SIGINT', () => {
          pin.unexport();
        });
      }
      else {
        console.log(this.name + ": Cooling ON")
      }
    }

    //Function for turning off cooling by sprinklers (Should not override watering)
    this.offCooling = function(){
      if(Gpio.accessible && pin != undefined) {
        pin.writeSync(0);
        process.on('SIGINT', () => {
          pin.unexport();
        });
      }
      else {
        console.log(this.name + ": Cooling OFF")
      }
    }

    //Function for turning on fertilizer
    this.onFertilize = function(){
      if(Gpio.accessible && pin != undefined) {
        pin.writeSync(1);
        this.fertilizePin.writeSync(1);
        this.fertilizeState = 1;
        process.on('SIGINT', () => {
          this.fertilizePin.unexport();
          pin.unexport();
        });
      }
      else {
        console.log(this.name + ": Fertilize ON")
      }
    }

      //Function for turning off fertilizer
    this.offFertilize = function(){
      if(Gpio.accessible && pin != undefined) {
        pin.writeSync(0);
        this.fertilizePin.writeSync(0);
        this.fertilizeState = 0;
        process.on('SIGINT', () => {
          this.fertilizePin.unexport();
          pin.unexport();
        });
      }
      else {
        console.log(this.name + ": Fertilize OFF")
      }
    }
    ////////////////////////////
    //TEMPERATURE SENSOR STUFF//
    ////////////////////////////
    //Get temperature data from probe, returns temperature based on degreeType specified in the settings file.
    this.getTemperatureFromProbe = function(){
      if (sensorIDs != undefined){
        ds18b20.temperature(sensorIDs[0], function(err, value){
          if (err)
            return err;
          else if (settings.degreeType == "F")
            return value;
          else
            return ((value - 32) * (5/9));
        });
      }
      else return "80"
    }

    //Sets the threshold for turning on heating, and whether or not it is enabled.
    //Stores info in the DB
    this.setHeatTemperature = function(value, checkbox){
      db.set(this.name + "HeatTemp",  {heatTemp: value, state: checkbox}).write();
    }

    this.setHeatStatus = function(value){
      db.set(this.name + "HeatTemp.enableState", value).write();
    }

    //Returns the threshold for turning on the heating, and whether or not it is enabled.
    this.getHeatTemperature = function(){
      return db.get(this.name + "HeatTemp").value();
    }

    //Sets the threshold for turning on cooling, and whether or not it is enabled.
    //Stores info in the DB.
    this.setCoolTemperature = function(value, checkbox){
      db.set(this.name + "CoolTemp",  {coolTemp: value, state: checkbox}).write();
    }

    this.setCoolStatus = function(value){
      db.set(this.name + "CoolTemp.enableState", value).write();
    }

    //Returns the threshold for turning on the cooling, and whether or not it is enabled.
    this.getCoolTemperature = function(){
      return db.get(this.name + "CoolTemp").value();
    }

    //Checks whether or not cooling should be turned on or off.
    this.temperatureCoolTask = function(err, data, probeTemp){
      if (err)
        console.log("ERROR: Cool task failed.");
      else {
        if (data.state == true && data.enableState == true && parseInt(probeTemp) >= parseInt(data.coolTemp)){
          this.temperatureState = "Cooling"
          this.onCooling();
        }
        if ((this.wateringState == 0 && probeTemp < data.coolTemp) || (this.wateringState == 0 && data.state == false)){
          this.temperatureState = "Off"
          this.offCooling();
        }
      }
    }

    //Checks whether or not heating should be turned on or off.
    this.temperatureHeatTask = function(err, data, probeTemp){
      if (err)
        console.log("ERROR: Heat task failed.");
      else {
        if (data.state == true && data.enableState == true && parseInt(probeTemp) <= parseInt(data.heatTemp)){
          this.temperatureState = "Heating"
          this.onHeating();
        }
        if ((probeTemp > data.heatTemp) || (data.state == false)){
          this.temperatureState = "Off"
          this.offHeating();
        }
      }
    }

    //Check temperature every 5 seconds to evaluate heating and cooling states
    // setInterval(() => {
    // this.temperatureHeatTask(this.getHeatTemperature(), this.getTemperatureFromProbe())
    // this.temperatureCoolTask(this.getCoolTemperature(), this.getTemperatureFromProbe())}, 5000);
  }
}

module.exports = Sprinkler;

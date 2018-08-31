const schedule = require('node-schedule');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const config = require('../config')
const Gpio = require('onoff').Gpio
const ds18b20 = require('ds18b20');

var sensorIDs = ds18b20.sensors(function(err, ids) {
  if (err){
    console.log(err)
  }
  else
    return ids;
});



var allTimerObjects = [];
Sprinkler = {

  //Initializes JSON Database if it does not exist.
  initializeDB: function(){
    if(db.getState() == 'undefined'){
      db.defaults({}).write();
    }
    else {
      console.log("DB already exists, skipping DB creation. . .")
    }
  },

  //Parses input into string for timers
  inputParser: (minute, hour, dayOfMonth, month, dayOfWeek) => {
    let outputString = ("0 " + minute + " " + hour + " " + dayOfMonth + " * " + dayOfWeek)
    return outputString;
  },

  CreateSprinkler: function(name, gpioPin, fertilizePin){
    this.name = name;
    this.gpioPin = gpioPin;
    this.timerObjects = [];
    this.fertilizePin = fertilizePin;
    this.wateringState = 0;

    if (Gpio.accessible) {
      var pin = new Gpio(this.gpioPin, 'out')
    } else {
        console.log('Virtual sprinkler now uses value: ' + this.gpioPin);
    }

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
        console.log(list[i].fertilizeState)
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
    //ON-OFF FUNCTIONS//
    ////////////////////
    //Triggered on startTime on raspberry pi
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

    //Triggered on stopTime on raspberry pi
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

    //Triggered on stopTime on raspberry pi
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


    this.onFertilize = function(){
      if(Gpio.accessible && pin != undefined) {
        pin.writeSync(1);
        this.fertilizePin.writeSync(1);
        process.on('SIGINT', () => {
          this.fertilizePin.unexport();
          pin.unexport();
        });
      }
      else {
        console.log(this.name + ": Fertilize ON")
      }
    }

      //Triggered on stopTime on raspberry pi
    this.offFertilize = function(){
      if(Gpio.accessible && pin != undefined) {
        pin.writeSync(0);
        this.fertilizePin.writeSync(0);
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
    this.getTemperatureFromProbe = function(){
      if (sensorIDs != undefined){
        ds18b20.temperature(sensorIDs[0], function(err, value){
          return value;
        });
      }
      else return "80"
    }

    this.setHeatTemperature = function(value, checkbox){
      db.set(this.name + "HeatTemp",  {heatTemp: value, state: checkbox}).write();
    }

    this.getHeatTemperature = function(){
      return db.get(this.name + "HeatTemp").value()
    }

    this.setCoolTemperature = function(value, checkbox){
      db.set(this.name + "CoolTemp",  {coolTemp: value, state: checkbox}).write();
    }

    this.getCoolTemperature = function(){
      return db.get(this.name + "CoolTemp").value()
    }

    this.temperatureCoolTask = function(data, probeTemp){
      if (data.state == true && parseInt(probeTemp) >= parseInt(data.coolTemp))
        this.onCooling();
      else if ((this.wateringState == 0 && probeTemp < data.coolTemp) || (this.wateringState == 0 && data.state == false))
        this.offCooling();
    }

    this.temperatureHeatTask = function(data, probeTemp){
      if (data.state == true && parseInt(probeTemp) <= parseInt(data.heatTemp))
        this.onHeating();
      else if ((probeTemp > data.heatTemp) || (data.state == false))
        this.offHeating();
    }

    //Check temperature every 5 seconds
    //setInterval(() => {
    //this.temperatureHeatTask(this.getHeatTemperature(), this.getTemperatureFromProbe())
    //this.temperatureCoolTask(this.getCoolTemperature(), this.getTemperatureFromProbe())}, 5000);
  }
}

module.exports = Sprinkler;
